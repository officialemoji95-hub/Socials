import { PropsWithChildren } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, spacing } from '../../theme/tokens';

interface AppScreenProps extends PropsWithChildren {
  title: string;
  scroll?: boolean;
  contentContainerStyle?: ViewStyle;
}

export const AppScreen = ({ title, children, scroll = false, contentContainerStyle }: AppScreenProps) => {
  const content = scroll ? (
    <ScrollView contentContainerStyle={[styles.content, contentContainerStyle]}>{children}</ScrollView>
  ) : (
    <SafeAreaView style={[styles.content, contentContainerStyle]}>{children}</SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {content}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: spacing.md
  },
  content: {
    gap: spacing.sm,
    paddingBottom: spacing.xl
  }
});
