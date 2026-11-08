import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import type { OfficeHolderSearchQueryDto } from '#/modules/governance/dto/office-holder-search-query.dto';
import type { OfficeHolderSearchResponseDto } from '#/modules/governance/dto/office-holder-search-response.dto';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Escapes LIKE wildcards so a search word is matched literally. */
export function likeWords(text: string): string {
  return `%${text.trim().replace(/[\\%_]/g, (c) => `\\${c}`).replace(/\s+/g, '%')}%`;
}

/**
 * Search office holders by person, office, institution, party and place; each row carries the names.
 *
 * Builds one parameterised query over holders, individuals, offices, institutions, the office's place
 * (and the unit above it, so a county matches its constituency seats) and the person's current party.
 * Words match case-insensitively in order; ids match exactly. Newest holdings first.
 */
@Injectable()
export class SearchOfficeHoldersUseCase {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async execute(input: OfficeHolderSearchQueryDto): Promise<OfficeHolderSearchResponseDto> {
    const where: string[] = [];
    const params: unknown[] = [];
    const add = (sql: string, value: unknown) => {
      params.push(value);
      where.push(sql.replace('?', `$${params.length}`));
    };
    const flag = (value: unknown) => value === true || value === 'true' || value === '1';
    if (input.q) add(`p.display_name ILIKE ? ESCAPE '\\'`, likeWords(input.q));
    if (input.office) add(`o.name ILIKE ? ESCAPE '\\'`, likeWords(input.office));
    if (input.institution) add(`i.name ILIKE ? ESCAPE '\\'`, likeWords(input.institution));
    if (input.county) {
      params.push(likeWords(input.county));
      const n = `$${params.length}`;
      where.push(`(u.name ILIKE ${n} ESCAPE '\\' OR up.name ILIKE ${n} ESCAPE '\\' OR o.description ILIKE '%County: ' || trim(both '%' from ${n}) || '.%')`);
    }
    if (input.party) {
      if (UUID.test(input.party)) add(`pa.id = ?`, input.party);
      else add(`pa.name ILIKE ? ESCAPE '\\'`, likeWords(input.party));
    }
    if (input.officeId) add(`h.office_id = ?`, input.officeId);
    if (input.institutionId) add(`o.institution_id = ?`, input.institutionId);
    if (input.personId) add(`h.person_id = ?`, input.personId);
    if (flag(input.current)) where.push(`h.is_current`);
    const limit = Math.min(Math.max(Number(input.limit) || 25, 1), 200);
    const page = Math.max(Number(input.page) || 1, 1);
    const from = `FROM governance.holders h
      JOIN person.individuals p ON p.id = h.person_id
      JOIN governance.offices o ON o.id = h.office_id
      JOIN governance.institutions i ON i.id = o.institution_id
      LEFT JOIN geography.units u ON u.id = o.scope_geo_unit_id
      LEFT JOIN geography.units up ON up.id = u.parent_id
      LEFT JOIN LATERAL (SELECT y.id, y.name FROM political.memberships m JOIN political.parties y ON y.id = m.party_id
                          WHERE m.person_id = p.id ORDER BY m.is_current DESC, m.valid_from DESC NULLS LAST LIMIT 1) pa ON true
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}`;
    const [count] = await this.dataSource.query(`SELECT count(*)::int AS total ${from}`, params);
    const rows = await this.dataSource.query(
      `SELECT h.id AS "holderId", p.id AS "personId", p.display_name AS "personName", o.id AS "officeId", o.name AS "officeName",
              i.id AS "institutionId", i.name AS "institutionName", u.name AS "placeName", pa.name AS "partyName",
              h.status, to_char(h.valid_from, 'YYYY-MM-DD') AS "validFrom", to_char(h.valid_to, 'YYYY-MM-DD') AS "validTo", h.is_current AS "isCurrent"
         ${from} ORDER BY h.is_current DESC, h.valid_from DESC NULLS LAST, p.display_name ASC LIMIT ${limit} OFFSET ${(page - 1) * limit}`,
      params,
    );
    return { results: rows, total: count.total, page, limit } as unknown as OfficeHolderSearchResponseDto;
  }
}
