import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../utils/theme';

interface ListStateProps {
  title: string;
  description: string;
  ctaLabel?: string;
  onPressCta?: () => void;
  danger?: boolean;
}

const ListState: React.FC<ListStateProps> = ({
  title,
  description,
  ctaLabel,
  onPressCta,
  danger,
}) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, danger ? styles.dangerTitle : undefined]}>
        {title}
      </Text>
      <Text style={styles.description}>{description}</Text>
      {ctaLabel && onPressCta ? (
        <Pressable style={styles.button} onPress={onPressCta}>
          <Text style={styles.buttonText}>{ctaLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  dangerTitle: {
    color: colors.danger,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  button: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 999,
    backgroundColor: colors.accentMuted,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  buttonText: {
    color: colors.accent,
    fontWeight: '700',
  },
});

export default React.memo(ListState);
