import type { CandidateDetail } from '@/lib/review/api';
import { decideAction, promoteAction } from '../../actions';
import { Badge, Empty, load, Notice, requireRole } from '../../ui';

type Json = Record<string, unknown>;

function parse(text: string | null): Json | null {
  if (!text) return null;
  try {
    const value = JSON.parse(text);
    return value && typeof value === 'object' ? (value as Json) : null;
  } catch {
    return null;
  }
}

const show = (value: unknown) => (value === undefined ? '' : typeof value === 'string' ? value : JSON.stringify(value));

/** Field by field: the staged value against the current canonical value, so a reviewer sees exactly what would change. */
function Diff({ payload, current }: { payload: Json; current: Json | null }) {
  const keys = [...new Set([...Object.keys(payload), ...Object.keys(current ?? {})])].filter((k) => k in payload);
  return (
    <div className="rv-table-wrap">
      <table className="rv-diff">
        <thead>
          <tr><th>Field</th><th>Staged</th>{current ? <th>Current record</th> : null}</tr>
        </thead>
        <tbody>
          {keys.map((key) => {
            const changed = current ? show(payload[key]) !== show(current[key]) : false;
            return (
              <tr key={key} className={changed ? 'changed' : undefined}>
                <td className="mono">{key}</td>
                <td className="mono">{show(payload[key])}</td>
                {current ? <td className="mono">{show(current[key])}</td> : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default async function CandidatePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  const role = await requireRole();
  const { id } = await params;
  const notice = await searchParams;
  const { data, error } = await load<CandidateDetail>(`/pipeline/candidates/${id}`);
  if (!data) return <><h1>Candidate</h1><Notice bad={error} /><Empty>This candidate could not be loaded.</Empty></>;
  const { candidate } = data;
  const payload = parse(data.payload) ?? {};
  const current = parse(data.current);
  const decided = ['approved', 'rejected', 'promoted'].includes(candidate.status);
  return (
    <>
      <h1>{candidate.targetKind}</h1>
      <p className="sub">
        <Badge value={candidate.status} /> staged {candidate.method.replaceAll('_', ' ')}
        {candidate.confidence !== null ? ` · confidence ${Math.round(candidate.confidence * 100)}%` : ''}
      </p>
      <Notice ok={notice.ok} bad={notice.bad ?? error} />

      <div className="rv-card">
        <h2>{current ? 'Staged against the current record' : 'Staged values (new record)'}</h2>
        <Diff payload={payload} current={current} />
      </div>

      <div className="rv-row">
        <div className="rv-card">
          <h2>Issues from validation ({data.issues.length})</h2>
          {data.issues.length === 0 ? <p>No issues were raised.</p> : (
            <ul>
              {data.issues.map((issue, index) => (
                <li key={index}><Badge value={issue.severity} /> <b>{issue.rule}</b>: {issue.message}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="rv-card">
          <h2>Where it came from</h2>
          <table>
            <tbody>
              <tr><td>Extraction result</td><td className="mono">{data.extractionResultId}</td></tr>
              <tr><td>Capture</td><td className="mono">{data.captureId ?? 'none recorded'}</td></tr>
              <tr><td>Segment</td><td className="mono">{data.segmentKey ?? ''}</td></tr>
              <tr><td>Locator</td><td className="mono">{data.locator ?? ''}</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="rv-card">
        <h2>Your decision</h2>
        {decided ? <p>This candidate is already {candidate.status}.</p> : (
          <form>
            <input type="hidden" name="id" value={id} />
            <label htmlFor="rationale">Rationale (required, kept with the record)</label>
            <textarea id="rationale" name="rationale" rows={3} required />
            <div className="rv-actions">
              <button className="primary" formAction={decideAction.bind(null, 'approve')} type="submit">Approve</button>
              <button formAction={decideAction.bind(null, 'request_changes')} type="submit">Hold: request changes</button>
              <button className="danger" formAction={decideAction.bind(null, 'reject')} type="submit">Reject</button>
            </div>
          </form>
        )}
        {candidate.status === 'approved' ? (
          <form action={promoteAction}>
            <input type="hidden" name="id" value={id} />
            <div className="rv-actions">
              <button className="primary" type="submit" >Promote to canonical record</button>
            </div>
          </form>
        ) : null}
      </div>
    </>
  );
}
