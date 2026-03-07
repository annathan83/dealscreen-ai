import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../../theme/tokens';

export interface NoteCardData {
  id: string;
  title: string;
  preview: string;
  createdAt: string;
}

interface NoteCardProps {
  note: NoteCardData;
  onPress: () => void;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 86400000) return 'Today';
  if (diff < 172800000) return 'Yesterday';
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function NoteCard({ note, onPress }: NoteCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Text style={styles.title} numberOfLines={1}>
        {note.title || 'Untitled note'}
      </Text>
      <Text style={styles.preview} numberOfLines={2}>
        {note.preview || 'No content'}
      </Text>
      <Text style={styles.date}>{formatDate(note.createdAt)}</Text>
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
  title: {
    ...typography.h2,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  preview: {
    ...typography.bodySmall,
    color: colors.secondary,
    marginBottom: spacing.sm,
  },
  date: {
    ...typography.caption,
    color: colors.muted,
  },
});
