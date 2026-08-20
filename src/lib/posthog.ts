import PostHog from "posthog-react-native";

const projectToken = process.env.EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.EXPO_PUBLIC_POSTHOG_HOST;

function requirePostHogConfiguration(variableName: string, value?: string) {
  if (!value && __DEV__) {
    throw new Error(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
    );
  }
}

requirePostHogConfiguration("EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN", projectToken);
requirePostHogConfiguration("EXPO_PUBLIC_POSTHOG_HOST", host);

export const posthog =
  projectToken && host
    ? new PostHog(projectToken, {
        host,
        captureAppLifecycleEvents: true,
      })
    : undefined;

// `debug` is a method on the client, not a constructor option.
if (posthog && __DEV__) {
  posthog.debug(true);
}
