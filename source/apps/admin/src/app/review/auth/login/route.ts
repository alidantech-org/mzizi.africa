import { NextResponse, type NextRequest } from 'next/server';

import { oidcConfigured } from '@/lib/review/auth';
import { authorizationUrl, newFlow } from '@/lib/review/oidc';

export async function GET(request: NextRequest) {
  if (!oidcConfigured()) return NextResponse.redirect(new URL('/review/login', request.url));
  const flow = newFlow();
  const redirectUri = new URL('/review/auth/callback', request.url).toString();
  const response = NextResponse.redirect(await authorizationUrl(redirectUri, flow));
  response.cookies.set('mzizi_oidc', JSON.stringify({ state: flow.state, verifier: flow.verifier }), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/review/auth',
    maxAge: 600,
  });
  return response;
}
