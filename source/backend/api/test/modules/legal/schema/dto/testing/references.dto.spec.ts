import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ReferencesDto } from "#/modules/legal/schema/dto/references.dto.ts";
import { referencesExample } from "@test/modules/legal/schema/dto/examples/references.dto.example.ts";

/** Managed by Dryv: ReferencesDto enforces exactly what the References contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ReferencesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = referencesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ReferencesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(referencesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...referencesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
