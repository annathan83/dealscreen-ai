import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../../theme/tokens';

export interface DealCardData {
  id: string;
  name: string;
  dealCode?: string;
  createdAt: string;
  notesCount: number;
  filesCount: number;
  lastActivity?: string;
}

interface DealCardProps {
  deal: DealCardData;
  onPress: () => void;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 86400000) return 'Today';
  if (diff < 172800000) return 'Yesterday';
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function DealCard({ deal, onPress }: DealCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {deal.name}
        </Text>
        {deal.dealCode ? (
          <Text style={styles.code}>{deal.dealCode}</Text>
        ) : null}
        <Text style={styles.meta}>
          {formatDate(deal.createdAt)} · {deal.notesCount} notes · {deal.filesCount} files
        </Text>
        {deal.lastActivity ? (
          <Text style={styles.lastActivity}>Last: {deal.lastActivity}</Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    padding: spacing.cardPadding,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  pressed: {
    opacity: 0.95,
  },
  content: {},
  name: {
    ...typography.h2,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  code: {
    ...typography.caption,
    color: colors.muted,
    marginBottom: spacing.sm,
  },
  meta: {
    ...typography.bodySmall,
    color: colors.secondary,
  },
  lastActivity: {
    ...typography.caption,
    color: colors.muted,
    marginTop: spacing.xs,
  },
});
