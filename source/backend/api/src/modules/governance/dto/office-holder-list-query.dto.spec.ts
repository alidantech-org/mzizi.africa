import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { OfficeHolderListQueryDto } from "#/modules/governance/dto/office-holder-list-query.dto.ts";
import { officeHolderListQueryExample } from "#/modules/governance/dto/office-holder-list-query.dto.example.ts";

/** Managed by Dryv: OfficeHolderListQueryDto enforces exactly what the OfficeHolderListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(OfficeHolderListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = officeHolderListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("OfficeHolderListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(officeHolderListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...officeHolderListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});