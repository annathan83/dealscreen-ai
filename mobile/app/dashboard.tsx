import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DealCard, FAB } from '../src/components/ui';
import type { DealCardData } from '../src/components/ui';
import { QuickCaptureModal } from '../src/components/QuickCaptureModal';
import type { QuickCaptureAction } from '../src/components/QuickCaptureModal';
import { colors, spacing, typography } from '../src/theme/tokens';

const MOCK_DEALS: DealCardData[] = [
  {
    id: '1',
    name: 'Manufacturing Co — Midwest',
    dealCode: 'DL-00001',
    createdAt: new Date().toISOString(),
    notesCount: 3,
    filesCount: 2,
    lastActivity: 'Note added 2h ago',
  },
  {
    id: '2',
    name: 'HVAC Services LLC',
    dealCode: 'DL-00002',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    notesCount: 1,
    filesCount: 0,
    lastActivity: 'Deal created',
  },
];

export default function DashboardScreen() {
  const router = useRouter();
  const [quickCaptureVisible, setQuickCaptureVisible] = useState(false);
  const [deals] = useState<DealCardData[]>(MOCK_DEALS);

  const handleDealPress = (id: string) => {
    router.push({ pathname: '/deal/[id]', params: { id } });
  };

  const handleNewDeal = () => {
    router.push('/new-deal');
  };

  const handleQuickCaptureAction = (action: QuickCaptureAction) => {
    setQuickCaptureVisible(false);
    if (action === 'add_note') {
      // Navigate to first deal's notes or show "Select deal" — MVP: go to first deal
      if (deals.length > 0) {
        router.push({ pathname: '/deal/[id]', params: { id: deals[0].id } });
      } else {
        router.push('/new-deal');
      }
    }
    if (action === 'upload_file') {
      if (deals.length > 0) {
        router.push({ pathname: '/deal/[id]', params: { id: deals[0].id } });
      }
    }
    if (action === 'paste_text') {
      if (deals.length > 0) {
        router.push({ pathname: '/deal/[id]', params: { id: deals[0].id } });
      }
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Deals</Text>
        <TouchableOpacity onPress={handleNewDeal} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={styles.newDeal}>New deal</Text>
        </TouchableOpacity>
      </View>

      {deals.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No deals yet</Text>
          <Text style={styles.emptySubtitle}>
            Create your first deal to start capturing notes and files.
          </Text>
          <Pressable onPress={handleNewDeal} style={styles.emptyButton}>
            <Text style={styles.emptyButtonText}>Create your first deal</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={deals}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.cardWrap}>
              <DealCard deal={item} onPress={() => handleDealPress(item.id)} />
            </View>
          )}
        />
      )}

      <View style={styles.fabWrap}>
        <FAB onPress={() => setQuickCaptureVisible(true)} />
      </View>

      <QuickCaptureModal
        visible={quickCaptureVisible}
        onClose={() => setQuickCaptureVisible(false)}
        onAction={handleQuickCaptureAction}
      />
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
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.primary,
  },
  newDeal: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: 100,
  },
  cardWrap: {
    marginBottom: spacing.md,
  },
  empty: {
    flex: 1,
    paddingHorizontal: spacing.screenHorizontal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    ...typography.h2,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...typography.bodySmall,
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  emptyButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  emptyButtonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: '600',
  },
  fabWrap: {
    position: 'absolute',
    right: spacing.screenHorizontal,
    bottom: 24,
  },
});
