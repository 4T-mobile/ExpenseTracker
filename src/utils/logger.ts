// import * as Sentry from "sentry-expo";
// export const logError = (error: unknown, context?: string) => {
//   if (__DEV__) {
//     console.error(`[${context ?? "Error"}]`, error);
//   } else {
//     Sentry.Native.captureException(error, { extra: { context } });
//   }
// };
export const logError = (error: unknown, context?: string) => {
  console.error(`[${context ?? "Error"}]`, error);
};
