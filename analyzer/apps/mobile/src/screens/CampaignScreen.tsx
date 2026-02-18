import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { CampaignCounts } from '../types';
import { api } from '../services/api';
import { AppButton } from '../components/ui/AppButton';
import { AppCard } from '../components/ui/AppCard';
import { AppScreen } from '../components/ui/AppScreen';
import { colors, spacing } from '../theme/tokens';

const initialCounts: CampaignCounts = {
  opted_in: 0,
  invited: 0,
  joined: 0,
  skipped: 0
};

export const CampaignScreen = () => {
  const [counts, setCounts] = useState<CampaignCounts>(initialCounts);
  const [running, setRunning] = useState(false);

  const runInvite = async () => {
    setRunning(true);
    try {
      const result = await api.runInviteCampaign();
      setCounts((prev) => ({
        ...prev,
        invited: prev.invited + result.queued,
        skipped: prev.skipped + result.skipped
      }));
      Alert.alert('Campaign executed', `Queued ${result.queued} invite(s).`);
    } catch (error) {
      Alert.alert('Campaign failed', String(error));
    } finally {
      setRunning(false);
    }
  };

  return (
    <AppScreen title="Campaign">
      <AppButton title={running ? 'Running...' : 'Invite non-members to Channel'} onPress={() => void runInvite()} disabled={running} />
      <AppCard style={styles.statsCard}>
        <StatRow label="opted_in" value={counts.opted_in} />
        <StatRow label="invited" value={counts.invited} />
        <StatRow label="joined" value={counts.joined} />
        <StatRow label="skipped" value={counts.skipped} />
      </AppCard>
    </AppScreen>
  );
};

const StatRow = ({ label, value }: { label: string; value: number }) => (
  <View style={styles.statRow}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  statsCard: {
    marginTop: spacing.sm
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs
  },
  statLabel: {
    color: colors.textSecondary,
    fontWeight: '600'
  },
  statValue: {
    color: colors.textPrimary,
    fontWeight: '800'
  }
});
