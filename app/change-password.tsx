import React, { useState } from 'react';
import { StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Container, Spacer } from '@/components/common/layout';
import { Heading, Text } from '@/components/common/typography';
import { PrimaryButton, SecondaryButton } from '@/components/common/buttons';
import { PasswordInput } from '@/components/common/inputs';
import { LoadingOverlay } from '@/components/common/feedback';
import { useChangePassword } from '@/src/hooks/useProfile';
import { ChangePasswordDto } from '@/src/types/user.type';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const changePasswordMutation = useChangePassword();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required.';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required.';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password.';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (formData.currentPassword && formData.newPassword && formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors in the form.');
      return;
    }

    try {
      const dto: ChangePasswordDto = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      };

      await changePasswordMutation.mutateAsync(dto);

      router.replace('/(main)/profile' as any);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to change password. Please try again.';
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Container>
            <Spacer size={16} />
            <Heading level="h2">Change Password</Heading>
            <Spacer size={8} />
            <Text variant="secondary">
              Please enter your current password and choose a new password.
            </Text>
            <Spacer size={24} />

            <PasswordInput
              label="Current Password"
              placeholder="Enter current password"
              value={formData.currentPassword}
              onChangeText={(text) => {
                setFormData({ ...formData, currentPassword: text });
                if (errors.currentPassword) {
                  setErrors({ ...errors, currentPassword: '' });
                }
              }}
              error={errors.currentPassword}
            />

            <PasswordInput
              label="New Password"
              placeholder="Enter new password"
              value={formData.newPassword}
              onChangeText={(text) => {
                setFormData({ ...formData, newPassword: text });
                if (errors.newPassword) {
                  setErrors({ ...errors, newPassword: '' });
                }
              }}
              error={errors.newPassword}
            />

            <PasswordInput
              label="Confirm New Password"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChangeText={(text) => {
                setFormData({ ...formData, confirmPassword: text });
                if (errors.confirmPassword) {
                  setErrors({ ...errors, confirmPassword: '' });
                }
              }}
              error={errors.confirmPassword}
            />

            <Spacer size={24} />

            <PrimaryButton
              title="Change Password"
              onPress={handleSubmit}
              loading={changePasswordMutation.isPending}
              disabled={changePasswordMutation.isPending}
              fullWidth
            />

            <Spacer size={12} />

            <SecondaryButton
              title="Cancel"
              onPress={() => router.back()}
              disabled={changePasswordMutation.isPending}
              fullWidth
            />

            <Spacer size={80} />
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <LoadingOverlay
        visible={changePasswordMutation.isPending}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
});
