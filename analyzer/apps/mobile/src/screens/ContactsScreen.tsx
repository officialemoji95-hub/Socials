import { useCallback, useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StateBadge } from '../components/StateBadge';
import { Contact } from '../types';
import { api } from '../services/api';
import { AppScreen } from '../components/ui/AppScreen';
import { AppInput } from '../components/ui/AppInput';
import { colors, spacing } from '../theme/tokens';

export const ContactsScreen = () => {
  const [search, setSearch] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadContacts = async () => {
    setRefreshing(true);
    setError('');
    try {
      const next = await api.getContacts();
      setContacts(next);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load contacts.');
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      void loadContacts();
    }, [])
  );

  const filtered = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return contacts;
    return contacts.filter((item) => item.display_name.toLowerCase().includes(normalized));
  }, [search, contacts]);

  return (
    <AppScreen title="Contacts">
      <AppInput value={search} onChangeText={setSearch} placeholder="Search contacts" autoCapitalize="none" />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadContacts} tintColor={colors.textPrimary} />}
        ListEmptyComponent={<Text style={styles.empty}>{refreshing ? 'Loading contacts…' : 'No contacts found.'}</Text>}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View>
              <Text style={styles.name}>{item.display_name}</Text>
              <Text style={styles.meta}>{item.platform_contact_id}</Text>
            </View>
            <StateBadge state={item.state} />
          </View>
        )}
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    gap: spacing.sm
  },
  row: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  name: {
    color: colors.textPrimary,
    fontWeight: '700'
  },
  meta: {
    color: colors.textSecondary,
    marginTop: 4
  },
  error: {
    color: colors.danger
  },
  empty: {
    color: colors.textSecondary,
    marginTop: spacing.md
  }
});
