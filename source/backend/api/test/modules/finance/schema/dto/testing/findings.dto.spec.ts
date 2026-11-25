import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FindingsDto } from "#/modules/finance/schema/dto/findings.dto.ts";
import { findingsExample } from "@test/modules/finance/schema/dto/examples/findings.dto.example.ts";

/** Managed by Dryv: FindingsDto enforces exactly what the Findings contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FindingsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = findingsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("FindingsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(findingsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...findingsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
