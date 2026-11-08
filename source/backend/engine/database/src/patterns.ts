import { join } from "node:path";
import type { DataSource } from "typeorm";

import { seedRoot } from "./config.ts";
import { CONFIDENCE, attribute, curatedMethod, ensureClassification, readJson, registerCuratedDocument } from "./curated.ts";
import { currentUnits, type Unit } from "./scope.ts";
import { rootUnitId } from "./seeds.ts";

/**
 * Pattern engine (TSK-02CA35EA9ED1, DEC-OFFICE-PATTERNS). A pattern says which posts, units and presence expectations exist for
 * every geography unit at a level, with legal cardinality, selection and basis. Generation is deterministic (codes are built from
 * the pattern's template and the unit), idempotent (an existing row is never rewritten), versioned (each version is a source
 * document and every row is attributed to it) and non-destructive (a row a newer version no longer justifies is retired with
 * `is_current = false` and a `valid_to`, never deleted). Patterns generate no coordinates, addresses, buildings or rooms.
 */
export interface PatternOffice {
  definition: string;
  title: string;
  min: number;
  max: number | null;
  appointingAuthority: string;
  selection: string;
  legalBasis: string;
  termYears?: number | null;
  maxTerms?: number | null;
  institution?: string;
  note?: string;
}
export interface PatternExpectation {
  subject: string;
  role: string;
  min: number;
  max: number | null;
  basis: "legal_rule" | "plan" | "pattern";
  legalBasis: string;
}
export interface Pattern {
  id: string;
  version: number;
  kind: "seat" | "unit";
  level: "national" | "county" | "constituency" | "ward";
  institution: string;
  description?: string;
  codeTemplate?: string;
  adopt?: "existing-scoped" | "existing-code-prefix";
  adoptPrefixes?: Record<string, string>;
  offices?: PatternOffice[];
  unit?: { type: string; codeTemplate: string; nameTemplate: string; generate: boolean };
  expectations: PatternExpectation[];
}
export interface PatternFile {
  _meta: { label: string };
  countyNumbers: Record<string, number>;
  legalTotals: Record<string, { expected: number; basis: string }>;
  patterns: Pattern[];
}

export const patternFile = join(seedRoot, "ke", "patterns", "ke-office-patterns.json");
const LEVELS = ["national", "county", "constituency", "ward"];

export function validatePatterns(file: PatternFile): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const p of file.patterns) {
    if (ids.has(p.id)) errors.push(`duplicate pattern ${p.id}`);
    ids.add(p.id);
    if (!Number.isInteger(p.version) || p.version < 1) errors.push(`${p.id}: version must be a positive integer`);
    if (!LEVELS.includes(p.level)) errors.push(`${p.id}: unknown level ${p.level}`);
    if (!p.institution) errors.push(`${p.id}: institution is required`);
    if (p.kind === "seat") {
      if (!p.codeTemplate?.includes("{definition}")) errors.push(`${p.id}: codeTemplate must contain {definition}`);
      if (p.level !== "national" && !/\{(no|path|code)\}/.test(p.codeTemplate ?? "")) errors.push(`${p.id}: codeTemplate must name the unit ({no}, {path} or {code}) or two units would share a code`);
      const defs = new Set<string>();
      for (const o of p.offices ?? []) {
        if (defs.has(o.definition)) errors.push(`${p.id}: duplicate definition ${o.definition}`);
        defs.add(o.definition);
        if (o.max !== null && o.max < o.min) errors.push(`${p.id}/${o.definition}: max below min`);
        if (!o.legalBasis) errors.push(`${p.id}/${o.definition}: legal basis is required`);
      }
    } else if (!p.unit || !/\{(no|path|code)\}/.test(p.unit.codeTemplate)) errors.push(`${p.id}: a unit pattern needs a unit codeTemplate naming the geography unit`);
    for (const e of p.expectations) {
      if (e.max !== null && e.max < e.min) errors.push(`${p.id} expectation ${e.role}: max below min`);
      const extra = Object.keys(e).filter((key) => !["subject", "role", "min", "max", "basis", "legalBasis"].includes(key));
      if (extra.length > 0) errors.push(`${p.id} expectation ${e.role}: a pattern must not carry addresses, coordinates, buildings or rooms (unexpected fields: ${extra.join(", ")})`);
    }
  }
  for (const [name, n] of Object.entries(file.countyNumbers)) if (!Number.isInteger(n) || n < 1 || n > 47) errors.push(`county number ${name} out of range`);
  return errors;
}

export interface TotalsCheck {
  level: string;
  expected: number;
  geography: number;
  generated: number;
  ok: boolean;
  note: string;
}
export interface PatternReport {
  patterns: number;
  officesCreated: number;
  officesAdopted: number;
  officesExisting: number;
  unitsCreated: number;
  expectationsCreated: number;
  rulesCreated: number;
  retired: { offices: number; units: number; expectations: number };
  missingInstitutions: string[];
  adoptionConflicts: string[];
  totals: TotalsCheck[];
  holdersLinked: Record<string, number>;
  holdersOnUnadoptedOffices: number;
}

const fill = (template: string, vars: Record<string, string>): string => template.replace(/\{(\w+)\}/g, (_, key) => {
  if (!(key in vars)) throw new Error(`template ${template} uses {${key}}, which is not available`);
  return vars[key]!;
});

export async function generateFromPatterns(db: DataSource, jurisdictionCode = "ke", path = patternFile, today = new Date().toISOString().slice(0, 10)): Promise<PatternReport> {
  const file = readJson<PatternFile>(path);
  const errors = validatePatterns(file);
  if (errors.length > 0) throw new Error(`office patterns are invalid:\n${errors.join("\n")}`);
  const [jurisdiction] = await db.query(`SELECT id FROM reference.jurisdictions WHERE code = $1`, [jurisdictionCode]);
  if (!jurisdiction) throw new Error(`jurisdiction ${jurisdictionCode} is not seeded`);
  const j: string = jurisdiction.id;
  const root = await rootUnitId(db, j);
  const units = await currentUnits(db, j);
  const byId = new Map(units.map((u) => [u.id, u]));
  const countyOf = (u: Unit): Unit | undefined => {
    for (let cursor: Unit | undefined = u; cursor; cursor = cursor.parentId ? byId.get(cursor.parentId) : undefined) if (cursor.level === "county") return cursor;
    return undefined;
  };
  const method = await curatedMethod(db);
  const instRows: Array<{ id: string; code: string; branch_id: string | null }> = await db.query(`SELECT id, code, branch_id FROM governance.institutions WHERE jurisdiction_id = $1 AND is_current`, [j]);
  const inst = new Map(instRows.map((r) => [r.code, r]));
  const report: PatternReport = { patterns: 0, officesCreated: 0, officesAdopted: 0, officesExisting: 0, unitsCreated: 0, expectationsCreated: 0, rulesCreated: 0, retired: { offices: 0, units: 0, expectations: 0 }, missingInstitutions: [], adoptionConflicts: [], totals: [], holdersLinked: {}, holdersOnUnadoptedOffices: 0 };
  const missing = new Set<string>();
  const unitType = (name: string) => ensureClassification(db, "governance/institution-type", name, j);

  for (const p of file.patterns) {
    report.patterns++;
    const docTitle = `Office pattern ${p.id} version ${p.version}`;
    const documentId = await registerCuratedDocument(db, j, docTitle, `${file._meta.label}. Seed file seed/ke/patterns/ke-office-patterns.json, pattern ${p.id} version ${p.version}: ${p.description ?? ""}`);
    const locator = `pattern ${p.id}@${p.version}`;
    const justified = { offices: new Set<string>(), units: new Set<string>(), expectations: new Set<string>() };
    const targets = p.level === "national" ? [units.find((u) => u.id === root)!] : units.filter((u) => u.level === p.level);

    for (const unit of targets) {
      const county = countyOf(unit);
      const number = county ? file.countyNumbers[county.code.split("/").pop()!] : undefined;
      if ((p.level === "county" || p.level === "ward" || p.level === "constituency") && p.codeTemplate?.includes("{no}") && !number) throw new Error(`county ${county?.code ?? unit.code} has no number in countyNumbers`);
      const vars: Record<string, string> = { name: unit.name, code: unit.code, path: unit.code.replace(/^[a-z]+\//, ""), no: String(number ?? "").padStart(3, "0"), countyCode: county?.code ?? "" };
      const officeIds = new Map<string, string>();

      if (p.kind === "seat") {
        for (const spec of p.offices ?? []) {
          const institutionCode = fill(spec.institution ?? p.institution, vars);
          const institution = inst.get(institutionCode);
          if (!institution) {
            missing.add(institutionCode);
            continue;
          }
          const code = fill(p.codeTemplate!, { ...vars, definition: spec.definition });
          const definitionCode = `${p.id}:${spec.definition}`;
          let [office] = await db.query(`SELECT id FROM governance.offices WHERE code = $1 OR (institution_id = $2 AND scope_geo_unit_id = $3 AND definition_code = $4 AND is_current) ORDER BY (code = $1) DESC LIMIT 1`, [code, institution.id, unit.id, definitionCode]);
          if (office) report.officesExisting++;
          else {
            let adopted: { id: string }[] = [];
            if (p.adopt === "existing-scoped") {
              adopted = await db.query(`SELECT id FROM governance.offices WHERE institution_id = $1 AND scope_geo_unit_id = $2 AND definition_code IS NULL AND is_current AND code !~ '/nominated(/|$)'`, [institution.id, unit.id]);
              if (adopted.length > 1) {
                report.adoptionConflicts.push(`${code}: ${adopted.length} existing offices of ${institutionCode} are scoped to ${unit.code}`);
                adopted = [];
              }
            }
            if (adopted.length === 1) {
              office = adopted[0];
              await db.query(`UPDATE governance.offices SET definition_code = $1, updated_at = now(), version = version + 1 WHERE id = $2`, [definitionCode, office.id]);
              report.officesAdopted++;
            } else {
              const description = `${fill(spec.title, vars)}. Cardinality ${spec.min} to ${spec.max ?? "no fixed maximum"}. Legal basis: ${spec.legalBasis}. Generated by ${locator}.${spec.note ? ` ${spec.note}` : ""}`;
              [office] = await db.query(
                `INSERT INTO governance.offices (code, name, institution_id, is_singleton, definition_code, scope_geo_unit_id, description, is_current, created_at, updated_at, version) VALUES ($1, $2, $3, $4, $5, $6, $7, true, now(), now(), 1) RETURNING id`,
                [code, fill(spec.title, vars).slice(0, 300), institution.id, spec.max === 1, definitionCode, unit.id, description.slice(0, 4000)],
              );
              report.officesCreated++;
            }
          }
          officeIds.set(spec.definition, office.id);
          justified.offices.add(office.id);
          await attribute(db, method, documentId, "governance.offices", office.id, CONFIDENCE.medium!, locator);

          // The cardinality rule: a changed rule retires the old one and writes a new one.
          const text = `Cardinality: ${spec.min} to ${spec.max ?? "no fixed maximum"}. Appointing authority: ${spec.appointingAuthority}. Legal basis: ${spec.legalBasis}.`.slice(0, 4000);
          const [current] = await db.query(`SELECT id, text_value FROM governance.rules WHERE office_id = $1 AND kind = 'other' AND is_current AND text_value LIKE 'Cardinality:%'`, [office.id]);
          if (!current || current.text_value !== text) {
            if (current) await db.query(`UPDATE governance.rules SET is_current = false, valid_to = $1, updated_at = now(), version = version + 1 WHERE id = $2`, [today, current.id]);
            await db.query(`INSERT INTO governance.rules (office_id, kind, text_value, is_current, created_at, updated_at, version) VALUES ($1, 'other', $2, true, now(), now(), 1)`, [office.id, text]);
            report.rulesCreated++;
            if (spec.termYears != null) await db.query(`INSERT INTO governance.rules (office_id, kind, numeric_value, is_current, created_at, updated_at, version) SELECT $1, 'term_length_years', $2, true, now(), now(), 1 WHERE NOT EXISTS (SELECT 1 FROM governance.rules WHERE office_id = $1 AND kind = 'term_length_years' AND is_current)`, [office.id, spec.termYears]);
            if (spec.maxTerms != null) await db.query(`INSERT INTO governance.rules (office_id, kind, numeric_value, is_current, created_at, updated_at, version) SELECT $1, 'max_terms', $2, true, now(), now(), 1 WHERE NOT EXISTS (SELECT 1 FROM governance.rules WHERE office_id = $1 AND kind = 'max_terms' AND is_current)`, [office.id, spec.maxTerms]);
          }
          const methodId = await ensureClassification(db, "governance/selection-method", spec.selection, j);
          const [procedure] = await db.query(`SELECT 1 AS ok FROM governance.procedures WHERE office_id = $1 AND method_id = $2 AND is_current`, [office.id, methodId]);
          if (!procedure) await db.query(`INSERT INTO governance.procedures (office_id, method_id, description, is_current, created_at, updated_at, version) VALUES ($1, $2, $3, true, now(), now(), 1)`, [office.id, methodId, `${spec.appointingAuthority} (${spec.legalBasis})`.slice(0, 4000)]);
        }
      }

      // A unit pattern creates an institution of type regional-office (or operational-unit) under the parent, scoped to the geography unit.
      let unitInstitutionId: string | undefined;
      const parent = inst.get(fill(p.institution, vars));
      if (p.kind === "unit") {
        if (!parent) {
          missing.add(p.institution);
          continue;
        }
        const unitCode = fill(p.unit!.codeTemplate, { ...vars, institution: parent.code });
        let [row] = await db.query(`SELECT id FROM governance.institutions WHERE code = $1`, [unitCode]);
        if (!row) {
          [row] = await db.query(
            `INSERT INTO governance.institutions (code, name, type_id, branch_id, jurisdiction_id, scope_geo_unit_id, description, is_current, created_at, updated_at, version) VALUES ($1, $2, $3, $4, $5, $6, $7, true, now(), now(), 1) RETURNING id`,
            [unitCode, fill(p.unit!.nameTemplate, vars).slice(0, 300), await unitType(p.unit!.type), parent.branch_id, j, unit.id, `Expected unit generated by ${locator}; it says a presence is expected, not that a building is known.`],
          );
          report.unitsCreated++;
        }
        unitInstitutionId = row.id;
        justified.units.add(row.id);
        const [rel] = await db.query(`SELECT 1 AS ok FROM governance.relationships WHERE subject_kind = 'institution' AND subject_id = $1 AND object_kind = 'institution' AND object_id = $2 AND kind = 'has_component' AND is_current`, [parent.id, row.id]);
        if (!rel) await db.query(`INSERT INTO governance.relationships (subject_kind, subject_id, object_kind, object_id, kind, is_current, created_at, updated_at, version) VALUES ('institution', $1, 'institution', $2, 'has_component'::governance.relationships_kind_enum, true, now(), now(), 1)`, [parent.id, row.id]);
        await attribute(db, method, documentId, "governance.institutions", row.id, CONFIDENCE.medium!, locator);
      }

      for (const e of p.expectations) {
        let subjectKind = "governance.institutions";
        let subjectId: string | undefined;
        if (e.subject === "institution") subjectId = parent?.id ?? inst.get(fill(p.institution, vars))?.id;
        else if (e.subject === "unit") subjectId = unitInstitutionId;
        else if (e.subject.startsWith("office:")) {
          subjectKind = "governance.offices";
          subjectId = officeIds.get(e.subject.slice(7));
        }
        if (!subjectId) continue;
        const roleId = await ensureClassification(db, "place/occupancy-role", e.role, j);
        const [found] = await db.query(`SELECT id FROM place.expectations WHERE subject_kind = $1 AND subject_id = $2 AND role_id = $3 AND scope_geo_unit_id = $4 AND basis = $5::place.expectations_basis_enum AND is_current`, [subjectKind, subjectId, roleId, unit.id, e.basis]);
        let id = found?.id as string | undefined;
        if (!id) {
          [{ id }] = await db.query(
            `INSERT INTO place.expectations (subject_kind, subject_id, role_id, scope_geo_unit_id, min_count, max_count, basis, status, is_current, created_at, updated_at, version) VALUES ($1, $2, $3, $4, $5, $6, $7::place.expectations_basis_enum, 'expected', true, now(), now(), 1) RETURNING id`,
            [subjectKind, subjectId, roleId, unit.id, e.min, e.max, e.basis],
          );
          report.expectationsCreated++;
        }
        justified.expectations.add(id!);
        await attribute(db, method, documentId, "place.expectations", id!, CONFIDENCE.medium!, `${locator}; ${e.legalBasis}`.slice(0, 500));
      }
    }

    // Adopt existing person-coded nominated seats by code prefix (they belong to no unit).
    if (p.adopt === "existing-code-prefix") {
      for (const [prefix, definition] of Object.entries(p.adoptPrefixes ?? {})) {
        const rows: Array<{ id: string }> = await db.query(`WITH upd AS (UPDATE governance.offices SET definition_code = $1, updated_at = now(), version = version + 1 WHERE code LIKE $2 AND definition_code IS NULL AND is_current RETURNING id) SELECT id FROM upd`, [`${p.id}:${definition}`, `${prefix}%`]);
        report.officesAdopted += rows.length;
        for (const row of rows) {
          justified.offices.add(row.id);
          await attribute(db, method, documentId, "governance.offices", row.id, CONFIDENCE.medium!, locator);
        }
      }
    }

    // Retire what an earlier version of this pattern generated and this version no longer justifies.
    const earlier: Array<{ target_kind: string; target_id: string }> = await db.query(
      `SELECT DISTINCT a.target_kind, a.target_id FROM source.attributions a JOIN source.documents d ON d.id = a.document_id WHERE d.title LIKE $1 AND d.title <> $2 AND a.target_kind IN ('governance.offices', 'governance.institutions', 'place.expectations')`,
      [`Office pattern ${p.id} version %`, docTitle],
    );
    for (const row of earlier) {
      if (row.target_kind === "governance.offices" && !justified.offices.has(row.target_id)) {
        const done = await db.query(`WITH upd AS (UPDATE governance.offices SET is_current = false, valid_to = $2, updated_at = now(), version = version + 1 WHERE id = $1 AND is_current RETURNING id) SELECT id FROM upd`, [row.target_id, today]);
        report.retired.offices += done.length;
      } else if (row.target_kind === "governance.institutions" && !justified.units.has(row.target_id)) {
        const done = await db.query(`WITH upd AS (UPDATE governance.institutions SET is_current = false, valid_to = $2, updated_at = now(), version = version + 1 WHERE id = $1 AND is_current RETURNING id) SELECT id FROM upd`, [row.target_id, today]);
        report.retired.units += done.length;
      } else if (row.target_kind === "place.expectations" && !justified.expectations.has(row.target_id)) {
        const done = await db.query(`WITH upd AS (UPDATE place.expectations SET is_current = false, valid_to = $2, updated_at = now(), version = version + 1 WHERE id = $1 AND is_current RETURNING id) SELECT id FROM upd`, [row.target_id, today]);
        report.retired.expectations += done.length;
      }
    }
  }
  report.missingInstitutions = [...missing].sort();

  // Totals against geography and law.
  const generated = async (definition: string): Promise<number> => (await db.query(`SELECT count(*)::int AS n FROM governance.offices WHERE definition_code = $1 AND is_current`, [definition]))[0].n;
  for (const [level, definition] of [["county", "county-executive:governor"], ["constituency", "constituency-mp:constituency-mp"], ["ward", "ward-mca:mca"]] as const) {
    const legal = file.legalTotals[level];
    const geography = units.filter((u) => u.level === level).length;
    const count = await generated(definition);
    report.totals.push({
      level,
      expected: legal?.expected ?? geography,
      geography,
      generated: count,
      ok: count === (legal?.expected ?? geography) && geography === (legal?.expected ?? geography),
      note: geography !== (legal?.expected ?? geography) ? `geography holds ${geography} ${level} units; the law fixes ${legal?.expected} (${legal?.basis})` : count !== geography ? `${geography - count} ${level} units have no generated post (missing institution or adoption conflict)` : "matches",
    });
  }

  // Holders linked to generated or adopted instances.
  const linked: Array<{ definition_code: string | null; n: number }> = await db.query(
    `SELECT o.definition_code, count(*)::int AS n FROM governance.holders h JOIN governance.offices o ON o.id = h.office_id WHERE h.is_current AND o.definition_code IS NOT NULL AND o.definition_code ~ '^(constituency-mp|county-national-seats|national-nominated-seats):' GROUP BY 1`,
  );
  for (const row of linked) report.holdersLinked[row.definition_code!] = row.n;
  report.holdersOnUnadoptedOffices = (await db.query(
    `SELECT count(*)::int AS n FROM governance.holders h JOIN governance.offices o ON o.id = h.office_id JOIN governance.institutions i ON i.id = o.institution_id WHERE h.is_current AND i.code IN ('ke/national-assembly', 'ke/senate') AND o.definition_code IS NULL`,
  ))[0].n;
  return report;
}
