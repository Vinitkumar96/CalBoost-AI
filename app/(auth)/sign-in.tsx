import { useSignIn } from '@clerk/expo';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { AuthScreen } from '@/components/auth/AuthScreen';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { handleAuthNavigate } from '@/lib/authNavigation';
import { errorMessage, isIdentifierNotFound } from '@/lib/clerkErrors';

export default function SignIn() {
  const router = useRouter();
  const { signIn, errors, fetchStatus } = useSignIn();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const submitting = fetchStatus === 'fetching';
  const canSubmit = emailAddress.trim().length > 0 && password.length > 0 && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setFormError(null);

    const { error } = await signIn.password({ emailAddress: emailAddress.trim(), password });

    if (error) {
      // No account with this email — hand the user straight to sign-up with what they typed.
      if (isIdentifierNotFound(error)) {
        router.replace({ pathname: '/(auth)/sign-up', params: { email: emailAddress.trim() } });
        return;
      }
      setFormError(errorMessage(error));
      return;
    }

    if (signIn.status === 'complete') {
      await signIn.finalize({ navigate: handleAuthNavigate });
      return;
    }

    // New-device verification: Clerk wants an emailed code before trusting this client.
    if (signIn.status === 'needs_client_trust' || signIn.status === 'needs_second_factor') {
      const emailFactor = signIn.supportedSecondFactors.find((factor) => factor.strategy === 'email_code');

      if (!emailFactor) {
        setFormError('This account needs two-factor verification, which isn’t supported in the app yet.');
        return;
      }

      const { error: sendError } = await signIn.mfa.sendEmailCode();
      if (sendError) {
        setFormError(errorMessage(sendError));
        return;
      }

      router.push({ pathname: '/(auth)/verify', params: { mode: 'mfa', email: emailAddress.trim() } });
    }
  };

  return (
    <AuthScreen title="Welcome back" subtitle="Sign in to pick up your streak where you left off.">
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
        error={errorMessage(errors.fields.identifier)}
      />
      <TextField
        icon="lock-closed-outline"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        onSubmitEditing={handleSubmit}
        secure
        autoComplete="current-password"
        textContentType="password"
        editable={!submitting}
        error={errorMessage(errors.fields.password)}
      />

      {formError ? (
        <Text className="text-caption text-danger" accessibilityLiveRegion="polite">
          {formError}
        </Text>
      ) : null}

      <View className="mt-4 items-stretch gap-4">
        <Button label="Sign in" onPress={handleSubmit} loading={submitting} disabled={!canSubmit} />

        <Pressable
          onPress={() => router.replace('/(auth)/sign-up')}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Create an account instead"
        >
          <Text className="text-center text-body text-ink-muted">
            New here? <Text className="font-semibold text-ink">Create an account</Text>
          </Text>
        </Pressable>
      </View>
    </AuthScreen>
  );
}
