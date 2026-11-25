import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { MappingsDto } from "#/modules/vocabulary/schema/dto/mappings.dto.ts";
import { mappingsExample } from "@test/modules/vocabulary/schema/dto/examples/mappings.dto.example.ts";

/** Managed by Dryv: MappingsDto enforces exactly what the Mappings contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(MappingsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = mappingsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("MappingsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(mappingsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...mappingsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
