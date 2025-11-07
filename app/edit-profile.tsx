import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Container, Spacer } from '@/components/common/layout';
import { Heading } from '@/components/common/typography';
import { PrimaryButton, SecondaryButton } from '@/components/common/buttons';
import { TextInput } from '@/components/common/inputs';
import { LoadingOverlay, LoadingSpinner } from '@/components/common/feedback';
import { useUserProfile, useUpdateProfile } from '@/src/hooks/useProfile';
import { UpdateProfileDto } from '@/src/types/user.type';

export default function EditProfileScreen() {
  const router = useRouter();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const updateProfileMutation = useUpdateProfile();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username,
        email: profile.email,
      });
    }
  }, [profile]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required.';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
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
      const dto: UpdateProfileDto = {
        username: formData.username.trim(),
        email: formData.email.trim(),
      };

      await updateProfileMutation.mutateAsync(dto);

      router.replace('/(main)/profile' as any);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to update profile. Please try again.';
      Alert.alert('Error', errorMessage);
    }
  };

  if (profileLoading) {
    return (
      <Screen>
        <LoadingSpinner text="Loading profile..." />
      </Screen>
    );
  }

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
            <Heading level="h2">Edit Profile</Heading>
            <Spacer size={24} />

            <TextInput
              label="Username"
              placeholder="Enter your username"
              value={formData.username}
              onChangeText={(text) => {
                setFormData({ ...formData, username: text });
                if (errors.username) {
                  setErrors({ ...errors, username: '' });
                }
              }}
              error={errors.username}
              autoCapitalize="none"
            />

            <TextInput
              label="Email"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(text) => {
                setFormData({ ...formData, email: text });
                if (errors.email) {
                  setErrors({ ...errors, email: '' });
                }
              }}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Spacer size={24} />

            <PrimaryButton
              title="Update Profile"
              onPress={handleSubmit}
              loading={updateProfileMutation.isPending}
              disabled={updateProfileMutation.isPending}
              fullWidth
            />

            <Spacer size={12} />

            <SecondaryButton
              title="Cancel"
              onPress={() => router.back()}
              disabled={updateProfileMutation.isPending}
              fullWidth
            />

            <Spacer size={80} />
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <LoadingOverlay
        visible={updateProfileMutation.isPending}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
});
