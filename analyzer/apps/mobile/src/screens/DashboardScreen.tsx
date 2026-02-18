import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../services/api';
import { ConnectedAccount } from '../types';
import { AppCard } from '../components/ui/AppCard';
import { AppScreen } from '../components/ui/AppScreen';
import { colors, spacing } from '../theme/tokens';

export const DashboardScreen = () => {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadAccounts = async () => {
    setRefreshing(true);
    try {
      const raw = await api.getAccounts();
      const mapped = raw.map((item) => ({
        id: item.id,
        platform: item.platform,
        username: item.username ?? item.platform_account_id,
        lastDetectedPost: String(item.metadata?.lastDetectedPost ?? 'No post detected')
      }));
      setAccounts(mapped);
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      void loadAccounts();
    }, [])
  );

  return (
    <AppScreen title="Dashboard">
      <FlatList
        contentContainerStyle={styles.list}
        data={accounts}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadAccounts} tintColor={colors.textPrimary} />}
        ListEmptyComponent={<Text style={styles.empty}>No connected accounts yet.</Text>}
        renderItem={({ item }) => (
          <AppCard>
            <Text style={styles.platform}>{item.platform}</Text>
            <Text style={styles.username}>@{item.username}</Text>
            <Text style={styles.subtle}>Last detected post: {item.lastDetectedPost}</Text>
          </AppCard>
        )}
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  list: {
    gap: spacing.sm,
    paddingBottom: spacing.xl
  },
  empty: {
    color: colors.textSecondary,
    marginTop: spacing.md
  },
  platform: {
    color: colors.textPrimary,
    fontWeight: '800',
    textTransform: 'capitalize'
  },
  username: {
    color: colors.textPrimary,
    fontWeight: '600'
  },
  subtle: {
    color: colors.textSecondary,
    marginTop: 4
  }
});
