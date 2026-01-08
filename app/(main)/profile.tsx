import React, { useState } from "react";
import { StyleSheet, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import * as Sentry from "@sentry/react-native";
import { Screen, Container, Spacer, Divider } from "@/components/common/layout";
import { Heading, Text } from "@/components/common/typography";
import { Card } from "@/components/common/cards";
import { PrimaryButton, SecondaryButton } from "@/components/common/buttons";
import { LoadingSpinner, ConfirmDialog } from "@/components/common/feedback";
import { useUserProfile } from "@/src/hooks/useProfile";
import { useLogoutMutation } from "@/src/hooks/useAuthMutation";
import { testSentryError, simulateApiError } from "@/src/utils/sentryTesting";

export default function ProfileScreen() {
  const router = useRouter();
  const { data: profile, isLoading } = useUserProfile();
  const logoutMutation = useLogoutMutation();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      router.replace("/login" as any);
    } catch (error) {
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  };

  const handleTestSentryError = () => {
    testSentryError("User Profile screen");
  };

  const handleSimulateApiError = () => {
    simulateApiError();
  };

  if (isLoading) {
    return (
      <Screen>
        <LoadingSpinner text="Loading profile..." />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Container>
          <Spacer size={16} />
          <Heading level="h2">Profile</Heading>
          <Spacer size={24} />

          {profile && (
            <>
              <Card>
                <Text variant="secondary" size="sm">
                  Username
                </Text>
                <Spacer size={4} />
                <Text weight="semibold" size="lg">
                  {profile.username}
                </Text>
                <Spacer size={16} />

                <Text variant="secondary" size="sm">
                  Email
                </Text>
                <Spacer size={4} />
                <Text weight="semibold" size="lg">
                  {profile.email}
                </Text>
                <Spacer size={16} />

                <Text variant="secondary" size="sm">
                  Member Since
                </Text>
                <Spacer size={4} />
                <Text weight="semibold" size="lg">
                  {new Date(profile.createdAt).toLocaleDateString()}
                </Text>
              </Card>

              <Spacer size={24} />

              <Text weight="semibold" size="lg">
                Settings
              </Text>
              <Spacer size={12} />

              <SecondaryButton
                title="Edit Profile"
                onPress={() => router.push("/edit-profile" as any)}
                fullWidth
              />
              <Spacer size={12} />

              <SecondaryButton
                title="Change Password"
                onPress={() => router.push("/change-password" as any)}
                fullWidth
              />

              <Spacer size={24} />
              <Divider />
              <Spacer size={24} />

              <Text weight="semibold" size="lg">
                Danger Zone
              </Text>
              <Spacer size={12} />

              <SecondaryButton
                title="Test Sentry Error (Profile)"
                onPress={handleTestSentryError}
                fullWidth
              />
              <Spacer size={12} />

              <SecondaryButton
                title="Test API Error (Simulated)"
                onPress={handleSimulateApiError}
                fullWidth
              />
              <Spacer size={12} />

              <PrimaryButton
                title="Logout"
                onPress={() => setShowLogoutDialog(true)}
                variant="danger"
                fullWidth
                loading={logoutMutation.isPending}
              />
            </>
          )}

          <Spacer size={80} />
        </Container>
      </ScrollView>

      <ConfirmDialog
        visible={showLogoutDialog}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutDialog(false)}
        loading={logoutMutation.isPending}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({});
