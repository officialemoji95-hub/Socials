import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../services/api';
import { ConnectedAccount } from '../types';

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
        lastDetectedPost: item.metadata?.lastDetectedPost ?? 'No post detected'
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
    <FlatList
      contentContainerStyle={{ padding: 16, gap: 12 }}
      data={accounts}
      keyExtractor={(item) => item.id}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadAccounts} />}
      ListHeaderComponent={<Text style={{ fontSize: 24, fontWeight: '700' }}>Dashboard</Text>}
      ListEmptyComponent={<Text style={{ color: '#6B7280' }}>No connected accounts yet.</Text>}
      renderItem={({ item }) => (
        <View style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, padding: 12 }}>
          <Text style={{ fontWeight: '700', textTransform: 'capitalize' }}>{item.platform}</Text>
          <Text>@{item.username}</Text>
          <Text style={{ color: '#374151', marginTop: 4 }}>Last detected post: {item.lastDetectedPost}</Text>
        </View>
      )}
    />
  );
};
