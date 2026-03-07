import React from 'react';
import {
  Modal,
  Pressable,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../theme/tokens';

export type QuickCaptureAction = 'add_note' | 'upload_file' | 'paste_text';

interface QuickCaptureModalProps {
  visible: boolean;
  onClose: () => void;
  onAction: (action: QuickCaptureAction) => void;
}

const actions: { key: QuickCaptureAction; label: string }[] = [
  { key: 'add_note', label: 'Add Note' },
  { key: 'upload_file', label: 'Upload File' },
  { key: 'paste_text', label: 'Paste Text' },
];

export function QuickCaptureModal({
  visible,
  onClose,
  onAction,
}: QuickCaptureModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.avoid}
          >
            <TouchableWithoutFeedback>
              <View style={styles.sheet}>
                <View style={styles.handle} />
                <Text style={styles.title}>Quick capture</Text>
                <Text style={styles.subtitle}>
                  Add information to your deal in one tap
                </Text>
                {actions.map((action) => (
                  <Pressable
                    key={action.key}
                    onPress={() => onAction(action.key)}
                    style={({ pressed }) => [
                      styles.action,
                      pressed && styles.actionPressed,
                    ]}
                  >
                    <Text style={styles.actionLabel}>{action.label}</Text>
                  </Pressable>
                ))}
                <View style={[styles.action, styles.actionDisabled]}>
                  <Text style={styles.actionLabel}>Deal Inbox</Text>
                  <Text style={styles.comingSoon}>Coming soon</Text>
                </View>
                <Pressable
                  onPress={onClose}
                  style={({ pressed }) => [styles.cancel, pressed && styles.actionPressed]}
                >
                  <Text style={styles.cancelLabel}>Cancel</Text>
                </Pressable>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
  },
  avoid: {
    width: '100%',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl + 24,
    ...shadows.modal,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.secondary,
    marginBottom: spacing.xl,
  },
  action: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: borderRadius.button,
    marginBottom: spacing.sm,
  },
  actionPressed: {
    opacity: 0.9,
  },
  actionDisabled: {
    opacity: 0.7,
  },
  comingSoon: {
    ...typography.caption,
    color: colors.muted,
    marginTop: 2,
  },
  actionLabel: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '500',
  },
  cancel: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  cancelLabel: {
    ...typography.bodySmall,
    color: colors.muted,
  },
});
