import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Tabs,
  NoteCard,
  FileCard,
  TimelineItem,
  Button,
} from '../src/components/ui';
import type { NoteCardData, FileCardData, TimelineItemData, TabItem } from '../src/components/ui';
import { colors, spacing, typography } from '../src/theme/tokens';

const TAB_ITEMS: TabItem[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'notes', label: 'Notes' },
  { key: 'files', label: 'Files' },
  { key: 'timeline', label: 'Timeline' },
];

const MOCK_NOTES: NoteCardData[] = [
  {
    id: 'n1',
    title: 'Broker intro call',
    preview: 'Spoke with John. Revenue ~$2.1M, SDE ~$420k. NDA sent.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'n2',
    title: 'Key numbers',
    preview: 'Asking 4.2x SDE. 12 employees. Lease expires 2026.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const MOCK_FILES: FileCardData[] = [
  {
    id: 'f1',
    fileName: 'CIM_Manufacturing_Co.pdf',
    fileType: 'application/pdf',
    uploadedAt: new Date().toISOString(),
  },
  {
    id: 'f2',
    fileName: 'Financials_Q3.pdf',
    fileType: 'application/pdf',
    uploadedAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

const MOCK_TIMELINE: TimelineItemData[] = [
  {
    id: 't1',
    type: 'note_created',
    description: 'Broker intro call',
    relativeTime: '2h ago',
  },
  {
    id: 't2',
    type: 'file_uploaded',
    description: 'CIM_Manufacturing_Co.pdf',
    relativeTime: '1d ago',
  },
  {
    id: 't3',
    type: 'deal_created',
    description: 'Deal created',
    relativeTime: '2d ago',
  },
];

export default function DealWorkspaceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  const dealName = 'Manufacturing Co — Midwest';
  const dealCode = 'DL-00001';
  const notesCount = MOCK_NOTES.length;
  const filesCount = MOCK_FILES.length;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.back}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.dealName}>{dealName}</Text>
        <Text style={styles.dealCode}>{dealCode}</Text>
        <View style={styles.stats}>
          <Text style={styles.stat}>{notesCount} notes</Text>
          <Text style={styles.statDot}>·</Text>
          <Text style={styles.stat}>{filesCount} files</Text>
        </View>

        <Tabs
          tabs={TAB_ITEMS}
          activeKey={activeTab}
          onChange={setActiveTab}
        />

        {activeTab === 'overview' && (
          <View style={styles.tabContent}>
            <Text style={styles.overviewText}>
              Summary and key details will appear here. Add notes and files to build your deal workspace.
            </Text>
          </View>
        )}

        {activeTab === 'notes' && (
          <View style={styles.tabContent}>
            <Pressable style={styles.addRow}>
              <Text style={styles.addLabel}>New note</Text>
            </Pressable>
            {MOCK_NOTES.map((note) => (
              <View key={note.id} style={styles.cardWrap}>
                <NoteCard
                  note={note}
                  onPress={() => {}}
                />
              </View>
            ))}
          </View>
        )}

        {activeTab === 'files' && (
          <View style={styles.tabContent}>
            <Pressable style={styles.uploadArea}>
              <Text style={styles.uploadLabel}>Upload file</Text>
              <Text style={styles.uploadHint}>PDF, images, documents</Text>
            </Pressable>
            {MOCK_FILES.map((file) => (
              <View key={file.id} style={styles.cardWrap}>
                <FileCard file={file} />
              </View>
            ))}
          </View>
        )}

        {activeTab === 'timeline' && (
          <View style={styles.tabContent}>
            {MOCK_TIMELINE.map((item) => (
              <TimelineItem key={item.id} item={item} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.sm,
  },
  back: {
    ...typography.bodySmall,
    color: colors.primary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: spacing.xxl,
  },
  dealName: {
    ...typography.h1,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  dealCode: {
    ...typography.caption,
    color: colors.muted,
    marginBottom: spacing.sm,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  stat: {
    ...typography.bodySmall,
    color: colors.secondary,
  },
  statDot: {
    ...typography.bodySmall,
    color: colors.muted,
    marginHorizontal: spacing.xs,
  },
  tabContent: {
    paddingTop: spacing.md,
  },
  overviewText: {
    ...typography.bodySmall,
    color: colors.secondary,
    lineHeight: 22,
  },
  addRow: {
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
  },
  addLabel: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '500',
  },
  cardWrap: {
    marginBottom: spacing.md,
  },
  uploadArea: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: 16,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  uploadLabel: {
    ...typography.body,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  uploadHint: {
    ...typography.caption,
    color: colors.muted,
  },
});
