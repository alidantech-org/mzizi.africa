import 'server-only';

import { createHash, randomBytes } from 'node:crypto';
import { createRemoteJWKSet, jwtVerify } from 'jose';

/** OpenID Connect against the configured issuer (any provider). Public client, authorization code with PKCE. */
const issuer = () => (process.env.OIDC_ISSUER as string).replace(/\/$/, '');
const clientId = () => process.env.OIDC_CLIENT_ID as string;

interface Discovery {
  authorization_endpoint: string;
  token_endpoint: string;
  jwks_uri: string;
  end_session_endpoint?: string;
}

export async function discover(): Promise<Discovery> {
  const response = await fetch(`${issuer()}/.well-known/openid-configuration`, { cache: 'no-store' });
  if (!response.ok) throw new Error(`the identity provider is not reachable (${response.status})`);
  return (await response.json()) as Discovery;
}

const b64 = (buffer: Buffer) => buffer.toString('base64url');

export function newFlow() {
  const verifier = b64(randomBytes(32));
  return { state: b64(randomBytes(16)), verifier, challenge: b64(createHash('sha256').update(verifier).digest()) };
}

export async function authorizationUrl(redirectUri: string, flow: { state: string; challenge: string }): Promise<string> {
  const url = new URL((await discover()).authorization_endpoint);
  url.search = new URLSearchParams({
    response_type: 'code',
    client_id: clientId(),
    redirect_uri: redirectUri,
    scope: 'openid profile',
    state: flow.state,
    code_challenge: flow.challenge,
    code_challenge_method: 'S256',
  }).toString();
  return url.toString();
}

/** Exchanges the code and verifies the access token's signature, issuer and expiry against the provider's keys. */
export async function exchange(code: string, redirectUri: string, verifier: string): Promise<{ token: string; expiresIn: number }> {
  const found = await discover();
  const response = await fetch(found.token_endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId(),
      code_verifier: verifier,
    }),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('the identity provider refused the sign-in code');
  const body = (await response.json()) as { access_token: string; expires_in: number };
  await jwtVerify(body.access_token, createRemoteJWKSet(new URL(found.jwks_uri)), { issuer: issuer() });
  return { token: body.access_token, expiresIn: body.expires_in };
}

export async function logoutUrl(returnTo: string): Promise<string | null> {
  const found = await discover();
  if (!found.end_session_endpoint) return null;
  const url = new URL(found.end_session_endpoint);
  url.search = new URLSearchParams({ client_id: clientId(), post_logout_redirect_uri: returnTo }).toString();
  return url.toString();
}
