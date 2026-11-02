import './review.css';

import { currentRole } from '@/lib/review/auth';
import { signOutAction } from './actions';
import { Nav } from './nav';

export const metadata = { title: 'Mzizi review workbench' };

export default async function ReviewLayout({ children }: { children: React.ReactNode }) {
  const role = await currentRole();
  return (
    <div className="rv">
      <div className="rv-shell">
        <nav className="rv-nav" aria-label="Review">
          <div className="rv-brand">
            Mzizi
            <small>Review workbench</small>
          </div>
          {role ? <Nav /> : null}
          {role ? (
            <form className="rv-who" action={signOutAction}>
              Signed in as <b>{role}</b> (development)
              <div className="rv-actions">
                <button type="submit">Sign out</button>
              </div>
            </form>
          ) : null}
        </nav>
        <main className="rv-main">{children}</main>
      </div>
    </div>
  );
}
