import { useMemo, useState } from 'react';
import { FlatList, Text, TextInput, View } from 'react-native';
import { StateBadge } from '../components/StateBadge';
import { Contact } from '../types';

const mockContacts: Contact[] = [
  { id: '1', display_name: 'Alex Harper', platform_contact_id: 'ig_101', state: 'opted_in' },
  { id: '2', display_name: 'Jamie Lin', platform_contact_id: 'ig_102', state: 'invited' },
  { id: '3', display_name: 'Priya Singh', platform_contact_id: 'tt_202', state: 'joined' },
  { id: '4', display_name: 'Noah Kim', platform_contact_id: 'ig_103', state: 'skipped' }
];

export const ContactsScreen = () => {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return mockContacts;
    return mockContacts.filter((item) => item.display_name.toLowerCase().includes(normalized));
  }, [search]);

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>Contacts</Text>
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search contacts"
        style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12 }}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>No contacts match your search.</Text>}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontWeight: '600' }}>{item.display_name}</Text>
              <Text style={{ color: '#6B7280' }}>{item.platform_contact_id}</Text>
            </View>
            <StateBadge state={item.state} />
          </View>
        )}
      />
    </View>
  );
};
