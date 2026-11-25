import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CasesDto } from "#/modules/community/schema/dto/cases.dto.ts";
import { casesExample } from "@test/modules/community/schema/dto/examples/cases.dto.example.ts";

/** Managed by Dryv: CasesDto enforces exactly what the Cases contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CasesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = casesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CasesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(casesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...casesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
