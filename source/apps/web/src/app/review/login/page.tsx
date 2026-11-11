import { devSignInAllowed, oidcConfigured } from '@/lib/review/auth';
import { signInAction } from '../actions';

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const { bad } = await searchParams;
  const allowed = await devSignInAllowed();
  return (
    <div className="rv-login rv-card">
      <h1>Sign in</h1>
      <p className="sub">
        Reviewers, people or AI agents, decide whether staged data becomes part of the record. Every decision is recorded against the
        approving account.
      </p>
      {bad ? <p className="rv-notice bad">{bad}</p> : null}
      {oidcConfigured() ? (
        <div className="rv-actions">
          <a className="btn primary" href="/review/auth/login">
            Sign in with single sign-on
          </a>
        </div>
      ) : allowed ? (
        <form action={signInAction}>
          <p>Development sign-in is available on localhost only. Choose an account seeded by the database engine.</p>
          <div className="rv-actions">
            <button className="primary" name="role" value="reviewer" type="submit">
              Sign in as dev reviewer
            </button>
            <button name="role" value="admin" type="submit">
              Sign in as dev admin
            </button>
          </div>
        </form>
      ) : (
        <p className="rv-notice bad">Development sign-in is disabled on this host. Single sign-on is not configured yet.</p>
      )}
    </div>
  );
}
