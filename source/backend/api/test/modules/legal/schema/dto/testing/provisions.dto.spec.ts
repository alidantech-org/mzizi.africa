import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ProvisionsDto } from "#/modules/legal/schema/dto/provisions.dto.ts";
import { provisionsExample } from "@test/modules/legal/schema/dto/examples/provisions.dto.example.ts";

/** Managed by Dryv: ProvisionsDto enforces exactly what the Provisions contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ProvisionsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = provisionsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ProvisionsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(provisionsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...provisionsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
