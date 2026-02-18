import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../../theme/tokens';

export const AppInput = (props: TextInputProps) => {
  return <TextInput placeholderTextColor={colors.textSecondary} style={styles.input} {...props} />;
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.textPrimary,
    backgroundColor: colors.surfaceElevated
  }
});
