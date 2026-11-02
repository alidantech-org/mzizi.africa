import 'server-only';

import { SignJWT, importPKCS8 } from 'jose';
import { cookies, headers } from 'next/headers';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Development sign-in (localhost only). Real OIDC plugs into the same API verifier later: the site would
 * then pass the identity provider's token instead of minting one. In production this refuses to sign in.
 */
export type DevRole = 'reviewer' | 'admin';
const ACCOUNTS: Record<DevRole, string> = {
  reviewer: '00000000-0000-4000-8000-0000000000a1',
  admin: '00000000-0000-4000-8000-0000000000a2',
};
const COOKIE = 'mzizi_dev_role';
const ISSUER = process.env.AUTH_ISSUER ?? 'https://dev.mzizi.local';
const LOCAL = new Set(['localhost', '127.0.0.1', '[::1]', '::1']);

export async function devSignInAllowed(): Promise<boolean> {
  if (process.env.NODE_ENV === 'production' && process.env.MZIZI_DEV_AUTH !== '1') return false;
  const host = ((await headers()).get('host') ?? '').replace(/:\d+$/, '');
  return LOCAL.has(host);
}

export async function currentRole(): Promise<DevRole | null> {
  const value = (await cookies()).get(COOKIE)?.value;
  return value === 'reviewer' || value === 'admin' ? value : null;
}

export async function signIn(role: DevRole): Promise<void> {
  if (!(await devSignInAllowed())) throw new Error('development sign-in is only available on localhost');
  (await cookies()).set(COOKIE, role, { httpOnly: true, sameSite: 'strict', path: '/' });
}

export async function signOut(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

function privateKeyPem(): string {
  if (process.env.DEV_AUTH_PRIVATE_KEY) return process.env.DEV_AUTH_PRIVATE_KEY.replace(/\\n/g, '\n');
  return readFileSync(join(process.cwd(), '..', '..', '..', '.data', 'dev-auth', 'private.pem'), 'utf8');
}

export async function mintToken(): Promise<string> {
  const role = await currentRole();
  if (!role) throw new Error('not signed in');
  if (!(await devSignInAllowed())) throw new Error('development sign-in is only available on localhost');
  const key = await importPKCS8(privateKeyPem(), 'RS256');
  return new SignJWT({ roles: [role] }).setProtectedHeader({ alg: 'RS256' }).setIssuer(ISSUER).setSubject(ACCOUNTS[role]).setExpirationTime('10m').sign(key);
}
