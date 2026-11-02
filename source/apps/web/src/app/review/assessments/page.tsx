import type { Meta } from '@/lib/review/api';
import { assessmentAction } from '../actions';
import { ago, Badge, Empty, load, Notice, Pager, requireRole } from '../ui';

interface Assessment { id: string; siteName: string; status: string; isCurrent: boolean; sourceType: string; rightsHolder: string; approvedScope: string; rationale: string | null; reviewedAt: string | null }
interface Dossier { id: string; jurisdictionName: string; launchStage: string; isCurrent: boolean; reviewedAt: string | null; openQuestions: string | null }

export default async function AssessmentsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const role = await requireRole();
  const params = await searchParams;
  const [assessments, dossiers] = await Promise.all([
    load<{ assessments: Assessment[]; meta: Meta }>('/pipeline/assessments', { page: params.page }),
    load<{ dossiers: Dossier[] }>('/pipeline/dossiers'),
  ]);
  return (
    <>
      <h1>Assessments and dossiers</h1>
      <p className="sub">No live collection happens for a site without a current approved assessment naming a human reviewer, and not before its jurisdiction dossier reaches pilot. Agents draft; people decide.</p>
      <Notice ok={params.ok} bad={params.bad ?? assessments.error} />
      <h2>Site assessments</h2>
      {assessments.data?.assessments.length === 0 ? <Empty>No assessments are drafted yet.</Empty> : null}
      {assessments.data && assessments.data.assessments.length > 0 ? (
        <>
          <div className="rv-table-wrap">
            <table>
              <thead><tr><th>Site</th><th>Status</th><th>Source</th><th>Rights holder</th><th>Scope</th><th>Reviewed</th><th /></tr></thead>
              <tbody>
                {assessments.data.assessments.map((a) => (
                  <tr key={a.id}>
                    <td>{a.siteName}{a.isCurrent ? '' : ' (superseded)'}</td>
                    <td><Badge value={a.status} /></td>
                    <td>{a.sourceType.replaceAll('_', ' ')}</td>
                    <td>{a.rightsHolder}</td>
                    <td className="mono">{a.approvedScope}</td>
                    <td>{ago(a.reviewedAt)}</td>
                    <td>
                      {a.isCurrent && ['in_review', 'not_reviewed'].includes(a.status) ? (
                        <form className="rv-actions" style={{ marginTop: 0 }}>
                          <input type="hidden" name="id" value={a.id} />
                          <button className="primary" formAction={assessmentAction.bind(null, 'approve')} type="submit" disabled={role !== 'admin'}>Approve</button>
                          <button className="danger" formAction={assessmentAction.bind(null, 'reject')} type="submit" disabled={role !== 'admin'}>Reject</button>
                        </form>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pager meta={assessments.data.meta} path="/review/assessments" />
        </>
      ) : null}
      {role !== 'admin' ? <p className="sub">Approving needs the assessment.approve permission, held by admin accounts for now.</p> : null}
      <h2 style={{ marginTop: 28 }}>Jurisdiction dossiers</h2>
      <Notice bad={dossiers.error} />
      {dossiers.data?.dossiers.length === 0 ? <Empty>No dossiers recorded.</Empty> : null}
      {dossiers.data && dossiers.data.dossiers.length > 0 ? (
        <div className="rv-table-wrap">
          <table>
            <thead><tr><th>Jurisdiction</th><th>Stage</th><th>Reviewed</th><th>Open questions</th></tr></thead>
            <tbody>
              {dossiers.data.dossiers.map((d) => (
                <tr key={d.id}><td>{d.jurisdictionName}</td><td><Badge value={d.launchStage} /></td><td>{ago(d.reviewedAt)}</td><td>{d.openQuestions ?? ''}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </>
  );
}
