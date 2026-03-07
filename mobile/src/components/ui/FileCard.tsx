import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../../theme/tokens';

export interface FileCardData {
  id: string;
  fileName: string;
  fileType: string;
  uploadedAt: string;
}

interface FileCardProps {
  file: FileCardData;
  onPress?: () => void;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function getTypeLabel(mime: string): string {
  if (mime.includes('pdf')) return 'PDF';
  if (mime.includes('image')) return 'Image';
  if (mime.includes('word') || mime.includes('document')) return 'Doc';
  return 'File';
}

export function FileCard({ file, onPress }: FileCardProps) {
  const typeLabel = file.fileType ? getTypeLabel(file.fileType) : 'File';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      disabled={!onPress}
    >
      <View style={styles.row}>
        <Text style={styles.name} numberOfLines={1}>
          {file.fileName}
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{typeLabel}</Text>
        </View>
      </View>
      <Text style={styles.date}>{formatDate(file.uploadedAt)}</Text>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  name: {
    ...typography.body,
    color: colors.primary,
    flex: 1,
  },
  badge: {
    backgroundColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },
  badgeText: {
    ...typography.caption,
    color: colors.secondary,
  },
  date: {
    ...typography.caption,
    color: colors.muted,
  },
});
