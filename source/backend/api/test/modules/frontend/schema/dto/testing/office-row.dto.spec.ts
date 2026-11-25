import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { OfficeRowDto } from "#/modules/frontend/schema/dto/office-row.dto.ts";
import { officeRowExample } from "@test/modules/frontend/schema/dto/examples/office-row.dto.example.ts";

/** Managed by Dryv: OfficeRowDto enforces exactly what the OfficeRow contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(OfficeRowDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = officeRowExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("OfficeRowDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(officeRowExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...officeRowExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
