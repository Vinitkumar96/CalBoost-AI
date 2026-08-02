import { useSignIn, useSignUp } from '@clerk/expo';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { AuthScreen } from '@/components/auth/AuthScreen';
import { OtpInput } from '@/components/auth/OtpInput';
import { Button } from '@/components/ui/Button';
import { handleAuthNavigate } from '@/lib/authNavigation';
import { cn } from '@/lib/cn';
import { errorMessage } from '@/lib/clerkErrors';

const RESEND_COOLDOWN_SECONDS = 30;

/**
 * Six-digit email code step. Serves two flows:
 * - `sign-up`  — verifying a brand new email address
 * - `mfa`      — new-device verification / second factor on an existing account
 *
 * Both the sign-in and sign-up attempts live on the Clerk client, so this screen picks
 * up whichever one the previous screen started.
 */
export default function Verify() {
  const router = useRouter();
  const { mode = 'sign-up', email } = useLocalSearchParams<{ mode?: 'sign-up' | 'mfa'; email?: string }>();

  const { signUp, errors: signUpErrors, fetchStatus: signUpStatus } = useSignUp();
  const { signIn, errors: signInErrors, fetchStatus: signInStatus } = useSignIn();

  const isMfa = mode === 'mfa';
  const submitting = (isMfa ? signInStatus : signUpStatus) === 'fetching';
  const fieldError = errorMessage(isMfa ? signInErrors.fields.code : signUpErrors.fields.code);

  const [code, setCode] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const verifying = useRef(false);

  // A code screen is meaningless without an attempt to verify against. `id` is only set once
  // sign-in/sign-up has actually been started, so this bounces anyone who arrives here cold.
  // Read once at mount: `finalize()` clears the attempt, and re-reading would redirect
  // out from under a *successful* verification before the layout guard routes to home.
  const [hasAttempt] = useState(() => Boolean(isMfa ? signIn.id : signUp.id));

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  if (!hasAttempt) return <Redirect href="/(auth)/welcome" />;

  const handleVerify = async (submittedCode: string) => {
    if (verifying.current) return;
    verifying.current = true;
    setFormError(null);

    try {
      if (isMfa) {
        const { error } = await signIn.mfa.verifyEmailCode({ code: submittedCode });
        if (error) {
          setFormError(errorMessage(error));
          setCode('');
          return;
        }
        if (signIn.status === 'complete') {
          await signIn.finalize({ navigate: handleAuthNavigate });
        }
        return;
      }

      const { error } = await signUp.verifications.verifyEmailCode({ code: submittedCode });
      if (error) {
        setFormError(errorMessage(error));
        setCode('');
        return;
      }
      if (signUp.status === 'complete') {
        await signUp.finalize({ navigate: handleAuthNavigate });
      } else {
        setFormError('We still need a bit more information to finish your account.');
      }
    } finally {
      verifying.current = false;
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setFormError(null);
    setCode('');

    const { error } = isMfa ? await signIn.mfa.sendEmailCode() : await signUp.verifications.sendEmailCode();
    if (error) {
      setFormError(errorMessage(error));
      return;
    }
    setCooldown(RESEND_COOLDOWN_SECONDS);
  };

  const handleChangeEmail = async () => {
    // Clear the attempt so the previous screen starts clean rather than resuming a stale one.
    await (isMfa ? signIn.reset() : signUp.reset());
    router.replace(isMfa ? '/(auth)/sign-in' : '/(auth)/sign-up');
  };

  const error = formError ?? fieldError;

  return (
    <AuthScreen
      title="Check your email"
      subtitle={email ? `We sent a 6-digit code to ${email}.` : 'We sent you a 6-digit code.'}
    >
      <OtpInput
        value={code}
        onChange={setCode}
        onComplete={handleVerify}
        invalid={!!error}
        editable={!submitting}
      />

      {error ? (
        <Text className="text-center text-caption text-danger" accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}

      <View className="mt-6 gap-4">
        <Button
          label="Verify"
          onPress={() => handleVerify(code)}
          loading={submitting}
          disabled={code.length < 6 || submitting}
        />

        <Pressable
          onPress={handleResend}
          disabled={cooldown > 0}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Resend the verification code"
        >
          <Text
            className={cn(
              'text-center text-body',
              cooldown > 0 ? 'font-normal text-ink-muted' : 'font-semibold text-ink',
            )}
          >
            {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
          </Text>
        </Pressable>

        <Pressable onPress={handleChangeEmail} hitSlop={8} accessibilityRole="button" accessibilityLabel="Use a different email">
          <Text className="text-center text-body text-ink-muted">Use a different email</Text>
        </Pressable>
      </View>
    </AuthScreen>
  );
}
