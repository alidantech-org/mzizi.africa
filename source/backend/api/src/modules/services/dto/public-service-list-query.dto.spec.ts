import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PublicServiceListQueryDto } from "#/modules/services/dto/public-service-list-query.dto.ts";
import { publicServiceListQueryExample } from "#/modules/services/dto/public-service-list-query.dto.example.ts";

/** Managed by Dryv: PublicServiceListQueryDto enforces exactly what the PublicServiceListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PublicServiceListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = publicServiceListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PublicServiceListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(publicServiceListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...publicServiceListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});