import { useSignUp } from '@clerk/expo';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { AuthScreen } from '@/components/auth/AuthScreen';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { errorMessage, isIdentifierExists } from '@/lib/clerkErrors';

const MIN_PASSWORD_LENGTH = 8;

export default function SignUp() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const { signUp, errors, fetchStatus } = useSignUp();

  const [emailAddress, setEmailAddress] = useState(email ?? '');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const submitting = fetchStatus === 'fetching';
  const canSubmit = emailAddress.trim().length > 0 && password.length >= MIN_PASSWORD_LENGTH && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setFormError(null);

    const trimmedEmail = emailAddress.trim();
    const { error } = await signUp.password({ emailAddress: trimmedEmail, password });

    if (error) {
      // Account already exists — send them to sign-in rather than making them retype.
      if (isIdentifierExists(error)) {
        router.replace('/(auth)/sign-in');
        return;
      }
      setFormError(errorMessage(error));
      return;
    }

    const { error: sendError } = await signUp.verifications.sendEmailCode();
    if (sendError) {
      setFormError(errorMessage(sendError));
      return;
    }

    router.push({ pathname: '/(auth)/verify', params: { mode: 'sign-up', email: trimmedEmail } });
  };

  return (
    <AuthScreen title="Create your account" subtitle="One account keeps your logs, streak and plan in sync.">
      <TextField
        icon="mail-outline"
        placeholder="Email address"
        value={emailAddress}
        onChangeText={setEmailAddress}
        onSubmitEditing={handleSubmit}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        editable={!submitting}
        error={errorMessage(errors.fields.emailAddress)}
      />
      <TextField
        icon="lock-closed-outline"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        onSubmitEditing={handleSubmit}
        secure
        autoComplete="new-password"
        textContentType="newPassword"
        editable={!submitting}
        error={errorMessage(errors.fields.password)}
      />
      <Text className="ml-1 text-caption text-ink-muted">At least {MIN_PASSWORD_LENGTH} characters.</Text>

      {formError ? (
        <Text className="text-caption text-danger" accessibilityLiveRegion="polite">
          {formError}
        </Text>
      ) : null}

      {/* Mount point for Clerk's bot protection. Required on any screen that creates a sign-up. */}
      <View nativeID="clerk-captcha" />

      <View className="mt-4 gap-4">
        <Button label="Create account" onPress={handleSubmit} loading={submitting} disabled={!canSubmit} />

        <Pressable
          onPress={() => router.replace('/(auth)/sign-in')}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Sign in to an existing account"
        >
          <Text className="text-center text-body text-ink-muted">
            Already have an account? <Text className="font-semibold text-ink">Sign In</Text>
          </Text>
        </Pressable>
      </View>
    </AuthScreen>
  );
}
