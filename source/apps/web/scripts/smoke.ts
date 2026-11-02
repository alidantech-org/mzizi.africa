// Smoke test for a running stack: bun scripts/smoke.ts [baseUrl]. Signs in with the dev cookie and loads every review page.
const base = process.argv[2] ?? 'http://localhost:3100';
const pages = ['', '/runs', '/jobs', '/sites', '/assessments', '/documents', '/captures', '/structure', '/checks', '/data', '/data/governance/institutions'];
let failed = 0;
for (const role of ['reviewer', 'admin']) {
  for (const path of pages) {
    const response = await fetch(`${base}/review${path}`, { headers: { cookie: `mzizi_dev_role=${role}` }, redirect: 'manual' });
    const body = await response.text();
    const broken = response.status !== 200 || /rv-notice bad/.test(body);
    if (broken) failed++;
    console.log(`${broken ? 'FAIL' : 'ok  '} ${role.padEnd(8)} /review${path} ${response.status}${/rv-notice bad[^>]*>([^<]*)/.exec(body)?.[1] ? ' ' + /rv-notice bad[^>]*>([^<]*)/.exec(body)?.[1] : ''}`);
  }
}
const anonymous = await fetch(`${base}/review`, { redirect: 'manual' });
if (anonymous.status !== 307 && anonymous.status !== 303) { failed++; console.log(`FAIL anonymous /review should redirect to login, got ${anonymous.status}`); }
process.exit(failed ? 1 : 0);
