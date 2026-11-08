import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LegalEntityListQueryDto } from "#/modules/entities/dto/legal-entity-list-query.dto.ts";
import { legalEntityListQueryExample } from "#/modules/entities/dto/legal-entity-list-query.dto.example.ts";

/** Managed by Dryv: LegalEntityListQueryDto enforces exactly what the LegalEntityListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LegalEntityListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = legalEntityListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("LegalEntityListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(legalEntityListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...legalEntityListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});