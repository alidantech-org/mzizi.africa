import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ReferenceWindowDto } from "#/modules/reference/schema/dto/reference-window.dto.ts";
import { referenceWindowExample } from "@test/modules/reference/schema/dto/examples/reference-window.dto.example.ts";

/** Managed by Dryv: ReferenceWindowDto enforces exactly what the ReferenceWindow contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ReferenceWindowDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = referenceWindowExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ReferenceWindowDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(referenceWindowExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...referenceWindowExample.valid(),
        unexpectedField: 1,
      }),
    ).toContain("unexpectedField");
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
