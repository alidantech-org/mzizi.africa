import type { MigrationInterface, QueryRunner } from "typeorm";

/**
 * PostGIS shapes derived from the GeoJSON text of geography.boundaries (decision: geometry is text
 * in contracts). Kept in a separate table so the Dryv-generated entity stays free of derived
 * columns. A trigger maintains it; invalid or unparseable GeoJSON yields a row with is_valid false
 * so the integrity check can report it instead of failing the insert.
 */
export class BoundaryShapes1793607884531 implements MigrationInterface {
  name = "BoundaryShapes1793607884531";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS postgis`);
    await queryRunner.query(`CREATE TABLE geography.boundary_shapes (
      boundary_id uuid PRIMARY KEY,
      geom geometry(Geometry, 4326),
      is_valid boolean NOT NULL DEFAULT false,
      computed_at timestamptz NOT NULL DEFAULT now()
    )`);
    await queryRunner.query(`CREATE INDEX idx_boundary_shapes_geom ON geography.boundary_shapes USING gist (geom)`);
    await queryRunner.query(`CREATE FUNCTION geography.sync_boundary_shape() RETURNS trigger LANGUAGE plpgsql AS \$\$
      DECLARE g geometry;
      BEGIN
        BEGIN
          g := ST_SetSRID(ST_GeomFromGeoJSON(NEW.geometry), 4326);
        EXCEPTION WHEN OTHERS THEN
          g := NULL;
        END;
        INSERT INTO geography.boundary_shapes (boundary_id, geom, is_valid, computed_at)
        VALUES (NEW.id, g, g IS NOT NULL AND ST_IsValid(g), now())
        ON CONFLICT (boundary_id) DO UPDATE SET geom = EXCLUDED.geom, is_valid = EXCLUDED.is_valid, computed_at = EXCLUDED.computed_at;
        RETURN NEW;
      END
    \$\$`);
    await queryRunner.query(`CREATE TRIGGER trg_boundary_shape AFTER INSERT OR UPDATE OF geometry ON geography.boundaries FOR EACH ROW EXECUTE FUNCTION geography.sync_boundary_shape()`);
    // Backfill rows that exist already.
    await queryRunner.query(`UPDATE geography.boundaries SET geometry = geometry`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS trg_boundary_shape ON geography.boundaries`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS geography.sync_boundary_shape()`);
    await queryRunner.query(`DROP TABLE IF EXISTS geography.boundary_shapes`);
  }
}
