import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing } from '../../theme/tokens';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

export const AppButton = ({ title, onPress, disabled = false, variant = 'primary' }: AppButtonProps) => {
  return (
    <Pressable disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.base, styles[variant], (pressed || disabled) && styles.dimmed]}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center'
  },
  primary: {
    backgroundColor: colors.brand
  },
  secondary: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border
  },
  text: {
    color: colors.textPrimary,
    fontWeight: '700'
  },
  dimmed: {
    opacity: 0.65
  }
});
