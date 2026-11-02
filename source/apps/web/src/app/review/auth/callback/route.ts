import { NextResponse, type NextRequest } from 'next/server';

import { ACCESS_COOKIE, oidcConfigured, roleFromToken } from '@/lib/review/auth';
import { exchange } from '@/lib/review/oidc';

export async function GET(request: NextRequest) {
  const fail = (message: string) => NextResponse.redirect(new URL(`/review/login?bad=${encodeURIComponent(message)}`, request.url));
  if (!oidcConfigured()) return fail('Single sign-on is not configured.');
  const saved = request.cookies.get('mzizi_oidc')?.value;
  const url = request.nextUrl;
  const code = url.searchParams.get('code');
  if (!saved || !code) return fail('The sign-in was not completed.');
  const flow = JSON.parse(saved) as { state: string; verifier: string };
  if (flow.state !== url.searchParams.get('state')) return fail('The sign-in response did not match the request.');
  try {
    const { token, expiresIn } = await exchange(code, new URL('/review/auth/callback', request.url).toString(), flow.verifier);
    if (!roleFromToken(token)) return fail('This account has no reviewer or admin role.');
    const response = NextResponse.redirect(new URL('/review', request.url));
    response.cookies.set(ACCESS_COOKIE, token, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: expiresIn });
    response.cookies.delete({ name: 'mzizi_oidc', path: '/review/auth' });
    return response;
  } catch (error) {
    return fail(error instanceof Error ? error.message : 'Sign-in failed.');
  }
}
