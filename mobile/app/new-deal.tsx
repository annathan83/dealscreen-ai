import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input } from '../src/components/ui';
import { colors, spacing, typography } from '../src/theme/tokens';

export default function NewDealScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setSaving(true);
    // MVP: simulate create then navigate to workspace
    await new Promise((r) => setTimeout(r, 400));
    setSaving(false);
    router.replace({ pathname: '/deal/[id]', params: { id: 'new-1' } });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.back}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>New deal</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Input
            label="Deal name"
            placeholder="e.g. Manufacturing Co — Midwest"
            value={name}
            onChangeText={setName}
            autoFocus
          />
          <Input
            label="Description (optional)"
            placeholder="Brief context or source"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            style={styles.descriptionInput}
          />
          <Button
            title="Create deal"
            onPress={handleCreate}
            disabled={!name.trim()}
            loading={saving}
            style={styles.button}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboard: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },
  back: {
    ...typography.bodySmall,
    color: colors.primary,
  },
  title: {
    ...typography.h1,
    color: colors.primary,
  },
  scroll: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: spacing.xxl,
  },
  descriptionInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: spacing.md,
  },
});
