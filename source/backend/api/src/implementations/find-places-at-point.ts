/** "Where am I?": the places whose subdivided pieces contain a point, smallest first (geography.pieces). */
import { Injectable, Optional } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { DataSource } from "typeorm";
import { PlaceAtPointDto } from "#/modules/geography/schema/dto/place-at-point.dto";
import type { PointQueryDto } from "#/modules/geography/schema/dto/point-query.dto";

/** One row of the point lookup as returned by PostgreSQL (the parsing boundary). */
interface PointRow {
  readonly feature_id: string;
  readonly code: string;
  readonly identity_kind: string;
  readonly kind_term: string;
  readonly from_year: number | null;
  readonly to_year: number | null;
}

const POINT_SQL = `
  select f.id as feature_id, f.code, f.identity_kind, f.kind_term, f.from_year, f.to_year
  from geography.pieces p
  join geography.features f on f.id = p.feature_id and f.deleted_at is null
  where ST_Intersects(p.geometry, ST_SetSRID(ST_MakePoint($1, $2), 4326))
  group by f.id
  order by min(ST_Area(p.geometry)) asc
  limit 20`;

@Injectable()
export class FindPlacesAtPointUseCase {
  /** Optional so HTTP specs can mock the service; the application registers the DataSource globally. */
  constructor(@Optional() private readonly injected?: DataSource) {}

  private get source(): DataSource {
    if (!this.injected) throw new Error("DataSource must be registered");
    return this.injected;
  }

  async execute(input: PointQueryDto): Promise<PlaceAtPointDto> {
    const rows: PointRow[] = await this.source.query(POINT_SQL, [input.longitude, input.latitude]);
    return plainToInstance(PlaceAtPointDto, {
      places: rows.map((row) => ({
        featureId: row.feature_id,
        code: row.code,
        identityKind: row.identity_kind,
        kindTerm: row.kind_term,
        fromYear: row.from_year,
        toYear: row.to_year,
        names: [],
      })),
    });
  }
}
