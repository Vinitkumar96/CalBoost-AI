import type { SessionResource } from '@clerk/expo/types';

/** Where a completed sign-in / sign-up lands. `/` resolves to the protected `(home)` group. */
export const AFTER_AUTH_ROUTE = '/' as const;

type NavigateParams = {
  session: SessionResource;
  decorateUrl: (url: string) => string;
};

/**
 * Callback for `signIn.finalize()` / `signUp.finalize()`.
 *
 * It deliberately does not navigate on the happy path: Clerk invokes this *before* the new
 * session is set as active, so pushing a route here would hit the `(auth)` layout guard while
 * `isSignedIn` is still false and bounce back to welcome. The guards in `(auth)/_layout.tsx`
 * and `(home)/_layout.tsx` do the routing the moment the session lands.
 *
 * What this callback is for is the one decision that must happen before activation: diverting
 * a session that still carries a pending task.
 * See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
 */
export function handleAuthNavigate({ session }: NavigateParams) {
  if (!session?.currentTask) return;

  // No task UI exists yet — none of the tasks are enabled on this instance. If one is ever
  // turned on in the dashboard, route to its screen here instead of falling through to home.
  if (__DEV__) {
    console.warn(`Session has a pending task (${session.currentTask.key}) with no screen to handle it.`);
  }
}
