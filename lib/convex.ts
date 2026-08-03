import { ConvexReactClient } from 'convex/react';

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL!;

if (!convexUrl) {
  throw new Error('Add EXPO_PUBLIC_CONVEX_URL to the .env.local file (npx convex dev writes it)');
}

/**
 * One client for the whole app, created at module scope so a re-render of the root layout
 * can't tear down the websocket and drop every live query with it.
 *
 * `unsavedChangesWarning` is a browser-only beforeunload hook; it has no meaning on a phone
 * and warns in dev if left on.
 */
export const convex = new ConvexReactClient(convexUrl, { unsavedChangesWarning: false });
