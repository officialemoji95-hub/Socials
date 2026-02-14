import { useState } from 'react';
import { Alert, Button, Text, View } from 'react-native';
import { CampaignCounts } from '../types';
import { api } from '../services/api';

const initialCounts: CampaignCounts = {
  opted_in: 0,
  invited: 0,
  joined: 0,
  skipped: 0
};

export const CampaignScreen = () => {
  const [counts, setCounts] = useState<CampaignCounts>(initialCounts);

  const runInvite = async () => {
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
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>Campaign</Text>
      <Button title="Invite non-members to Channel" onPress={runInvite} />

      <View style={{ marginTop: 8, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, padding: 12, gap: 6 }}>
        <Text>opted_in: {counts.opted_in}</Text>
        <Text>invited: {counts.invited}</Text>
        <Text>joined: {counts.joined}</Text>
        <Text>skipped: {counts.skipped}</Text>
      </View>
    </View>
  );
};
