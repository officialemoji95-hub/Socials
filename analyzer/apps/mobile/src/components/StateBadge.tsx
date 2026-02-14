import { Text, View } from 'react-native';
import { ContactState } from '../types';

const stateColors: Record<ContactState, string> = {
  opted_in: '#0EA5E9',
  invited: '#F59E0B',
  joined: '#10B981',
  skipped: '#9CA3AF',
  do_not_contact: '#EF4444'
};

export const StateBadge = ({ state }: { state: ContactState }) => {
  return (
    <View style={{ backgroundColor: stateColors[state], paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 }}>
      <Text style={{ color: '#fff', fontWeight: '600', fontSize: 12 }}>{state}</Text>
    </View>
  );
};
