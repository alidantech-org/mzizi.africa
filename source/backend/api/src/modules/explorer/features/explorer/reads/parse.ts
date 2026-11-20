/** The sole untyped database boundary for explorer reads. Never cast query results into response DTOs. */
import { InternalServerErrorException } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import type { DataSource } from "typeorm";

export interface DtoConstructor<T extends object> {
  new (): T;
}
export type SqlParameter = string | number | boolean | null;
export async function queryRows<T extends object>(
  db: DataSource,
  sql: string,
  parameters: readonly SqlParameter[],
  dto: DtoConstructor<T>,
): Promise<T[]> {
  const raw: unknown = await db.query(sql, [...parameters]);
  if (!Array.isArray(raw))
    throw new InternalServerErrorException("The explorer read did not return rows.");
  return Promise.all(
    raw.map(async (row: unknown) => {
      if (row === null || typeof row !== "object" || Array.isArray(row))
        throw new InternalServerErrorException("The explorer returned an invalid row.");
      const value = plainToInstance(dto, row);
      const errors = await validate(value, { whitelist: true, forbidNonWhitelisted: true });
      if (errors.length)
        throw new InternalServerErrorException(
          "The explorer read does not match its declared contract.",
        );
      return value;
    }),
  );
}
