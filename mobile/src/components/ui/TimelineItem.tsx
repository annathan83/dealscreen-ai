import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../theme/tokens';

export type TimelineEventType = 'note_created' | 'file_uploaded' | 'deal_created';

export interface TimelineItemData {
  id: string;
  type: TimelineEventType;
  description: string;
  relativeTime: string;
}

const eventLabels: Record<TimelineEventType, string> = {
  note_created: 'Note',
  file_uploaded: 'File',
  deal_created: 'Deal',
};

interface TimelineItemProps {
  item: TimelineItemData;
}

export function TimelineItem({ item }: TimelineItemProps) {
  const label = eventLabels[item.type];

  return (
    <View style={styles.row}>
      <View style={styles.dot} />
      <View style={styles.content}>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.meta}>
          {label} · {item.relativeTime}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 6,
    marginRight: spacing.md,
  },
  content: {},
  description: {
    ...typography.bodySmall,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  meta: {
    ...typography.caption,
    color: colors.muted,
  },
});
