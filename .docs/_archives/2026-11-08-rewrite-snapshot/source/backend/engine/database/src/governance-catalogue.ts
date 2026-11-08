import { join } from "node:path";
import type { DataSource } from "typeorm";

import { seedRoot } from "./config.ts";
import { CONFIDENCE, attribute, curatedMethod, ensureClassification, readJson, registerCuratedDocument } from "./curated.ts";
import { rootUnitId, seedGovernanceStructure } from "./seeds.ts";

/**
 * Loads the extended governance catalogue (TSK-0FDD5A808362): `seed/ke/governance/ke-governance-structure.json` is the single catalogue.
 * Institutions come from `seedGovernanceStructure`; this adds each institution's scope (required), offices with their cardinality,
 * appointing authority, term and legal basis, headquarters and other expectations, and national facilities. The file is registered
 * as a source document (publisher "Mzizi curated research") and every row it creates is attributed to it with method curated.
 * Idempotent: nothing that exists is overwritten, and rerunning writes nothing.
 */
export interface OfficeSeed {
  slug: string;
  title: string;
  min: number;
  max: number | null;
  appointingAuthority: string;
  selection: string;
  termYears: number | null;
  maxTerms: number | null;
  legalBasis: string;
  singleton: boolean;
}
export interface ExpectationSeed {
  role: string;
  scope: string;
  min: number;
  max: number | null;
  basis: "legal_rule" | "plan" | "pattern";
  legalBasis: string;
  knownUnknowns?: string[];
}
export interface InstitutionSeed {
  code: string;
  name: string;
  type: string;
  branch: string;
  parent: string | null;
  confidence: string;
  scope?: string;
  offices?: OfficeSeed[];
  expectations?: ExpectationSeed[];
  knownUnknowns?: string[];
}
export interface FacilitySeed {
  code: string;
  name: string;
  sector: string;
  operator: string;
  unit: string;
}
export interface CatalogueFile {
  _meta: { label: string; version?: number };
  institutions: InstitutionSeed[];
  facilities?: FacilitySeed[];
}

export const catalogueFile = join(seedRoot, "ke", "governance", "ke-governance-structure.json");

/** Pure validation: returns every problem found, empty when the file is sound. Scope is required on every institution. */
export function validateCatalogue(file: CatalogueFile): string[] {
  const errors: string[] = [];
  const codes = new Set<string>();
  for (const row of file.institutions) {
    if (codes.has(row.code)) errors.push(`duplicate institution ${row.code}`);
    codes.add(row.code);
  }
  for (const row of file.institutions) {
    if (!row.scope) errors.push(`${row.code}: scope is required ("national" or a geography unit code)`);
    if (row.parent && !codes.has(row.parent)) errors.push(`${row.code}: unknown parent ${row.parent}`);
    if (!["high", "medium", "low"].includes(row.confidence)) errors.push(`${row.code}: confidence must be high, medium or low`);
    const slugs = new Set<string>();
    for (const office of row.offices ?? []) {
      if (slugs.has(office.slug)) errors.push(`${row.code}: duplicate office ${office.slug}`);
      slugs.add(office.slug);
      if (office.max !== null && office.max < office.min) errors.push(`${row.code}/${office.slug}: max below min`);
      if (!office.appointingAuthority || !office.legalBasis) errors.push(`${row.code}/${office.slug}: appointing authority and legal basis are required`);
    }
    for (const e of row.expectations ?? []) {
      if (e.max !== null && e.max < e.min) errors.push(`${row.code} expectation ${e.role}: max below min`);
      if (!["legal_rule", "plan", "pattern"].includes(e.basis)) errors.push(`${row.code} expectation ${e.role}: unknown basis ${e.basis}`);
      if (!e.scope) errors.push(`${row.code} expectation ${e.role}: scope is required`);
    }
  }
  for (const f of file.facilities ?? []) {
    if (!codes.has(f.operator)) errors.push(`facility ${f.code}: unknown operator ${f.operator}`);
  }
  return errors;
}

export interface CatalogueReport {
  institutions: number;
  officesCreated: number;
  officesExisting: number;
  rules: number;
  procedures: number;
  expectations: number;
  facilities: number;
  attributions: number;
  scopesSet: number;
}

export async function seedGovernanceCatalogue(db: DataSource, jurisdictionCode = "ke", path = catalogueFile): Promise<CatalogueReport> {
  const file = readJson<CatalogueFile>(path);
  const errors = validateCatalogue(file);
  if (errors.length > 0) throw new Error(`governance catalogue is invalid:\n${errors.slice(0, 20).join("\n")}`);
  const [jurisdiction] = await db.query(`SELECT id FROM reference.jurisdictions WHERE code = $1`, [jurisdictionCode]);
  if (!jurisdiction) throw new Error(`jurisdiction ${jurisdictionCode} is not seeded`);
  const j: string = jurisdiction.id;
  const root = await rootUnitId(db, j);
  await seedGovernanceStructure(db, jurisdictionCode);

  const unitCache = new Map<string, string>();
  const scopeId = async (scope: string): Promise<string> => {
    if (scope === "national") return root;
    if (unitCache.has(scope)) return unitCache.get(scope)!;
    const [unit] = await db.query(`SELECT id FROM geography.units WHERE code = $1 AND jurisdiction_id = $2 AND is_current`, [scope, j]);
    if (!unit) throw new Error(`scope ${scope} is not a geography unit of ${jurisdictionCode}`);
    unitCache.set(scope, unit.id);
    return unit.id;
  };

  const title = `Kenya governance structure seed (ke-governance-structure.json), version ${file._meta.version ?? 1}`;
  const documentId = await registerCuratedDocument(db, j, title, `${file._meta.label}. Seed file seed/ke/governance/ke-governance-structure.json; rows are attributed to this document with method curated.`);
  const method = await curatedMethod(db);
  const report: CatalogueReport = { institutions: 0, officesCreated: 0, officesExisting: 0, rules: 0, procedures: 0, expectations: 0, facilities: 0, attributions: 0, scopesSet: 0 };
  const attr = async (kind: string, id: string, confidence: string, locator: string) => {
    if (await attribute(db, method, documentId, kind, id, CONFIDENCE[confidence] ?? 0.35, locator)) report.attributions++;
  };

  const ids = new Map<string, string>();
  for (const row of file.institutions) {
    const [inst] = await db.query(`SELECT id, scope_geo_unit_id FROM governance.institutions WHERE code = $1 AND jurisdiction_id = $2 AND is_current`, [row.code, j]);
    if (!inst) throw new Error(`institution ${row.code} was not created by the structure seed`);
    ids.set(row.code, inst.id);
    const wanted = await scopeId(row.scope!);
    if (inst.scope_geo_unit_id === null) {
      await db.query(`UPDATE governance.institutions SET scope_geo_unit_id = $1, updated_at = now(), version = version + 1 WHERE id = $2`, [wanted, inst.id]);
      report.scopesSet++;
    }
    report.institutions++;
    await attr("governance.institutions", inst.id, row.confidence, `institutions[${row.code}]`);
  }

  for (const row of file.institutions) {
    const institutionId = ids.get(row.code)!;
    const officeScope = await scopeId(row.scope!);
    for (const office of row.offices ?? []) {
      const code = `${row.code}/${office.slug}`;
      let [existing] = await db.query(`SELECT id, definition_code FROM governance.offices WHERE code = $1`, [code]);
      if (existing) {
        report.officesExisting++;
        if (!existing.definition_code) await db.query(`UPDATE governance.offices SET definition_code = $1, updated_at = now(), version = version + 1 WHERE id = $2`, [`${row.code}:${office.slug}`, existing.id]);
      } else {
        const description = `${office.title}. Cardinality ${office.min} to ${office.max ?? "no fixed maximum"}. Appointing authority: ${office.appointingAuthority}. Legal basis: ${office.legalBasis}. ${file._meta.label}; confidence ${row.confidence}.`;
        [existing] = await db.query(
          `INSERT INTO governance.offices (code, name, institution_id, is_singleton, definition_code, scope_geo_unit_id, description, is_current, created_at, updated_at, version) VALUES ($1, $2, $3, $4, $5, $6, $7, true, now(), now(), 1) RETURNING id`,
          [code, office.title, institutionId, office.singleton, `${row.code}:${office.slug}`, officeScope, description.slice(0, 4000)],
        );
        report.officesCreated++;
      }
      await attr("governance.offices", existing.id, row.confidence, `institutions[${row.code}].offices[${office.slug}]`);
      const rule = async (kind: string, numeric: number | null, text: string | null) => {
        const [found] = await db.query(`SELECT 1 AS ok FROM governance.rules WHERE office_id = $1 AND kind = $2::governance.rules_kind_enum AND numeric_value IS NOT DISTINCT FROM $3 AND text_value IS NOT DISTINCT FROM $4 AND is_current`, [existing.id, kind, numeric, text]);
        if (found) return;
        await db.query(`INSERT INTO governance.rules (office_id, kind, numeric_value, text_value, is_current, created_at, updated_at, version) VALUES ($1, $2::governance.rules_kind_enum, $3, $4, true, now(), now(), 1)`, [existing.id, kind, numeric, text]);
        report.rules++;
      };
      if (office.termYears !== null) await rule("term_length_years", office.termYears, null);
      if (office.maxTerms !== null) await rule("max_terms", office.maxTerms, null);
      await rule("other", null, `Cardinality: ${office.min} to ${office.max ?? "no fixed maximum"}. Appointing authority: ${office.appointingAuthority}. Legal basis: ${office.legalBasis}.`.slice(0, 4000));
      const methodId = await ensureClassification(db, "governance/selection-method", office.selection, j);
      const [procedure] = await db.query(`SELECT 1 AS ok FROM governance.procedures WHERE office_id = $1 AND method_id = $2 AND is_current`, [existing.id, methodId]);
      if (!procedure) {
        await db.query(`INSERT INTO governance.procedures (office_id, method_id, description, is_current, created_at, updated_at, version) VALUES ($1, $2, $3, true, now(), now(), 1)`, [existing.id, methodId, `${office.appointingAuthority} (${office.legalBasis})`.slice(0, 4000)]);
        report.procedures++;
      }
    }
    for (const e of row.expectations ?? []) {
      const roleId = await ensureClassification(db, "place/occupancy-role", e.role, j);
      const scope = await scopeId(e.scope);
      const [found] = await db.query(
        `SELECT id FROM place.expectations WHERE subject_kind = 'governance.institutions' AND subject_id = $1 AND role_id = $2 AND scope_geo_unit_id = $3 AND basis = $4::place.expectations_basis_enum AND is_current`,
        [institutionId, roleId, scope, e.basis],
      );
      let expectationId = found?.id as string | undefined;
      if (!expectationId) {
        [{ id: expectationId }] = await db.query(
          `INSERT INTO place.expectations (subject_kind, subject_id, role_id, scope_geo_unit_id, min_count, max_count, basis, status, is_current, created_at, updated_at, version) VALUES ('governance.institutions', $1, $2, $3, $4, $5, $6::place.expectations_basis_enum, 'expected', true, now(), now(), 1) RETURNING id`,
          [institutionId, roleId, scope, e.min, e.max, e.basis],
        );
        report.expectations++;
      }
      await attr("place.expectations", expectationId!, row.confidence, `institutions[${row.code}].expectations[${e.role}]; ${e.legalBasis}`);
    }
  }

  for (const f of file.facilities ?? []) {
    const sectorId = await ensureClassification(db, "civic/sector", f.sector, j);
    let [amenity] = await db.query(`SELECT id FROM civic.amenities WHERE code = $1`, [f.code]);
    if (!amenity) {
      [amenity] = await db.query(`INSERT INTO civic.amenities (code, name, jurisdiction_id, sector_id, is_active, is_current, created_at, updated_at, version) VALUES ($1, $2, $3, $4, true, true, now(), now(), 1) RETURNING id`, [f.code, f.name, j, sectorId]);
      report.facilities++;
    }
    const operator = ids.get(f.operator)!;
    const [rel] = await db.query(`SELECT 1 AS ok FROM governance.relationships WHERE subject_kind = 'amenity' AND subject_id = $1 AND object_kind = 'institution' AND object_id = $2 AND kind = 'operated_by' AND is_current`, [amenity.id, operator]);
    if (!rel) await db.query(`INSERT INTO governance.relationships (subject_kind, subject_id, object_kind, object_id, kind, is_current, created_at, updated_at, version) VALUES ('amenity', $1, 'institution', $2, 'operated_by'::governance.relationships_kind_enum, true, now(), now(), 1)`, [amenity.id, operator]);
    const roleId = await ensureClassification(db, "place/occupancy-role", "service-site", j);
    const scope = await scopeId(f.unit);
    const [exp] = await db.query(`SELECT id FROM place.expectations WHERE subject_kind = 'civic.amenities' AND subject_id = $1 AND role_id = $2 AND scope_geo_unit_id = $3 AND is_current`, [amenity.id, roleId, scope]);
    let expectationId = exp?.id as string | undefined;
    if (!expectationId) {
      [{ id: expectationId }] = await db.query(`INSERT INTO place.expectations (subject_kind, subject_id, role_id, scope_geo_unit_id, min_count, max_count, basis, status, is_current, created_at, updated_at, version) VALUES ('civic.amenities', $1, $2, $3, 1, 1, 'plan', 'expected', true, now(), now(), 1) RETURNING id`, [amenity.id, roleId, scope]);
      report.expectations++;
    }
    await attr("civic.amenities", amenity.id, "medium", `facilities[${f.code}]`);
    await attr("place.expectations", expectationId!, "medium", `facilities[${f.code}] expected in ${f.unit}`);
  }
  return report;
}
