'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { api, ApiError } from '@/lib/review/api';
import { headers } from 'next/headers';

import { oidcConfigured, signIn, signOut, type DevRole } from '@/lib/review/auth';
import { logoutUrl } from '@/lib/review/oidc';

export async function signInAction(formData: FormData): Promise<void> {
  const role = formData.get('role') === 'admin' ? 'admin' : 'reviewer';
  await signIn(role as DevRole);
  redirect('/review');
}

export async function signOutAction(): Promise<void> {
  await signOut();
  if (oidcConfigured()) {
    const host = (await headers()).get('host') ?? 'localhost:3100';
    const target = await logoutUrl(`http://${host}/review/login`).catch(() => null);
    if (target) redirect(target);
  }
  redirect('/review/login');
}

function back(path: string, kind: 'ok' | 'bad', message: string): never {
  redirect(`${path}?${kind}=${encodeURIComponent(message)}`);
}

/** Records a review decision, then asks the database engine to apply it to the candidate. */
export async function decideAction(decision: 'approve' | 'request_changes' | 'reject', formData: FormData): Promise<void> {
  const id = String(formData.get('id'));
  const path = `/review/candidates/${id}`;
  const rationale = String(formData.get('rationale') ?? '').trim();
  if (!rationale) back(path, 'bad', 'A rationale is required for every decision.');
  const proposedState = decision === 'approve' ? 'unverified' : decision === 'reject' ? 'rejected' : 'under_review';
  try {
    await api('/audit/decisions', {
      method: 'POST',
      body: { targetKind: 'staging.candidates', targetId: id, decision, proposedState, rationale },
    });
    await api('/pipeline/reviews/apply', { method: 'POST' });
  } catch (error) {
    back(path, 'bad', error instanceof ApiError ? error.message : 'The decision could not be recorded.');
  }
  revalidatePath('/review');
  back(path, 'ok', `Decision recorded: ${decision.replace('_', ' ')}.`);
}

export async function promoteAction(formData: FormData): Promise<void> {
  const id = String(formData.get('id'));
  const path = `/review/candidates/${id}`;
  let message: string;
  try {
    const result = await api<{ outcome: string; reason: string | null }>(`/pipeline/candidates/${id}/promote`, { method: 'POST' });
    message = result.outcome === 'promoted' ? 'Promoted to the canonical record.' : `Deferred: ${result.reason ?? 'no reason given'}`;
    revalidatePath('/review');
    back(path, result.outcome === 'promoted' ? 'ok' : 'bad', message);
  } catch (error) {
    if (error instanceof ApiError) back(path, 'bad', error.message);
    throw error;
  }
}

export async function assessmentAction(verb: 'approve' | 'reject', formData: FormData): Promise<void> {
  const id = String(formData.get('id'));
  try {
    await api(`/pipeline/assessments/${id}/${verb}`, { method: 'POST' });
  } catch (error) {
    if (error instanceof ApiError) back('/review/assessments', 'bad', error.message);
    throw error;
  }
  revalidatePath('/review/assessments');
  back('/review/assessments', 'ok', verb === 'approve' ? 'Assessment approved and recorded against your account.' : 'Assessment rejected.');
}

/** A reviewer drafts an assessment. It is recorded as in_review and never authorises collection by itself. */
export async function draftAssessmentAction(formData: FormData): Promise<void> {
  const field = (name: string) => String(formData.get(name) ?? '').trim();
  const hosts = field('hosts')
    .split(/[\s,]+/)
    .filter(Boolean);
  const rate = Number(field('rate') || '0.2');
  if (!field('siteId') || !field('rightsHolder') || hosts.length === 0)
    back('/review/assessments', 'bad', 'Choose a site, name the rights holder and list at least one host.');
  try {
    await api('/pipeline/assessments', {
      method: 'POST',
      body: {
        siteId: field('siteId'),
        accessBasis: field('accessBasis'),
        sourceType: field('sourceType'),
        rightsHolder: field('rightsHolder'),
        approvedScope: JSON.stringify({ hosts, maxRequestsPerSecond: rate }),
        rationale: field('rationale') || undefined,
        evidence: field('evidence') || undefined,
      },
    });
  } catch (error) {
    if (error instanceof ApiError) back('/review/assessments', 'bad', error.message);
    throw error;
  }
  revalidatePath('/review/assessments');
  back('/review/assessments', 'ok', 'Draft recorded as in review. A person with assessment.approve must still decide it.');
}
