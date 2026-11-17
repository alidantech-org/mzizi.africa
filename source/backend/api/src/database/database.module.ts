import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GeometriesEntity } from "#/modules/geography/schema/entities/geometries.entity.ts";

/**
 * The application's database connection. Scaffolded by Dryv once; this file belongs to the
 * project. Feature modules register their entities with TypeOrmModule.forFeature, so
 * autoLoadEntities picks them up. Install the driver you choose (for PostgreSQL: `pg`).
 *
 * Entities used only by hand-written use cases are registered here, because no generated feature
 * module lists them: the geometry operations read `GeometriesEntity` (a Dryv read query cannot plan a
 * schema with a geometry field, so those operations have no generated query).
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: "postgres",
        url: process.env.DATABASE_URL,
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    TypeOrmModule.forFeature([GeometriesEntity]),
  ],
})
export class DatabaseModule {}
