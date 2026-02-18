import { Text, View } from 'react-native';
import { ContactState } from '../types';
import { colors, radius, spacing } from '../theme/tokens';

const stateColors: Record<ContactState, string> = {
  opted_in: colors.info,
  invited: colors.warning,
  joined: colors.success,
  skipped: '#64748B',
  do_not_contact: colors.danger
};

export const StateBadge = ({ state }: { state: ContactState }) => {
  return (
    <View style={{ backgroundColor: stateColors[state], paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.pill }}>
      <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>{state}</Text>
    </View>
  );
};
