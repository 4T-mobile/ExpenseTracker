/**
 * Sentry Testing Utilities
 * Use these functions to verify Sentry integration is working correctly.
 * WARNING: These functions are for development/testing purposes only.
 */

import * as Sentry from "@sentry/react-native";
import { Alert } from "react-native";

/**
 * Simulate an API error for Sentry testing.
 * Catches and reports the error without crashing the app.
 */
export const simulateApiError = async (): Promise<void> => {
  try {
    // Simulate a failed API call
    await Promise.reject(new Error("Simulated API error for Sentry testing"));
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        source: "api_simulation",
        testType: "simulated_api_error",
      },
    });
    Alert.alert(
      "API Error Captured",
      "Simulated API error has been sent to Sentry"
    );
  }
};

/**
 * Test Sentry error capture without crashing the app.
 * Creates an error, captures it, and shows a confirmation.
 */
export const testSentryError = (screenName: string): void => {
  const error = new Error(`Sentry test error from ${screenName}`);
  Sentry.captureException(error, {
    tags: {
      source: "ui_test",
      screen: screenName,
      testType: "manual_error_test",
    },
  });
  Alert.alert("Success", `Test error from ${screenName} sent to Sentry`);
};

/**
 * Send a test message to Sentry.
 */
export const sendTestMessage = (
  message: string,
  level: "info" | "warning" | "error" = "info"
): void => {
  Sentry.captureMessage(message, level);
};

/**
 * Fatal crash test - DO NOT ENABLE IN PRODUCTION.
 * Uncomment only for testing crash reporting.
 * This will crash the app and send a crash report to Sentry.
 */
// export const testFatalCrash = (): void => {
//   // WARNING: This will crash the app. Only use for testing crash reporting.
//   throw new Error('FATAL CRASH TEST - DO NOT ENABLE IN PRODUCTION');
// };

/**
 * Setup global error handler for uncaught JavaScript errors.
 * Call this once during app initialization.
 */
export const setupGlobalErrorHandler = (): void => {
  const originalErrorHandler = ErrorUtils.getGlobalHandler();

  ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
    // Capture the error in Sentry
    Sentry.captureException(error, {
      tags: {
        source: "global_error_handler",
        isFatal: (isFatal ?? false).toString(),
        testType: "uncaught_error",
      },
    });

    // Call the original error handler to maintain default behavior
    originalErrorHandler(error, isFatal);
  });
};
