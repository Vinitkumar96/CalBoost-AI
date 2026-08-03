/**
 * Without this file `ctx.auth.getUserIdentity()` returns `null` on every request, however
 * valid the token is.
 *
 * `domain` is the Issuer of the Clerk JWT template, which must be named exactly `convex` —
 * `applicationID` is checked against the token's `aud` claim, and the Convex preset sets
 * that to `convex`. Convex discovers the signing keys at `{domain}/.well-known/openid-configuration`,
 * so a trailing slash on the issuer breaks it.
 *
 * Set with: npx convex env set CLERK_JWT_ISSUER_DOMAIN https://<your-instance>.clerk.accounts.dev
 */
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: 'convex',
    },
  ],
};
