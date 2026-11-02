import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

/**
 * The application's database connection. Scaffolded by Dryv once; this file belongs to the
 * project. Feature modules register their entities with TypeOrmModule.forFeature, so
 * autoLoadEntities picks them up. Install the driver you choose (for PostgreSQL: `pg`).
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
  ],
})
export class DatabaseModule {}
