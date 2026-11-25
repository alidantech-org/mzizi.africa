import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { UseEntryDto } from "#/modules/media/schema/dto/use-entry.dto.ts";
import { useEntryExample } from "@test/modules/media/schema/dto/examples/use-entry.dto.example.ts";

/** Managed by Dryv: UseEntryDto enforces exactly what the UseEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(UseEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = useEntryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("UseEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(useEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...useEntryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
