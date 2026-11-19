import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ProceduresDto } from "#/modules/governance/schema/dto/procedures.dto.ts";
import { proceduresExample } from "@test/modules/governance/schema/dto/examples/procedures.dto.example.ts";

/** Managed by Dryv: ProceduresDto enforces exactly what the Procedures contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ProceduresDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = proceduresExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ProceduresDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(proceduresExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...proceduresExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
