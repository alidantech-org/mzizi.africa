import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ProvisionEntryDto } from "#/modules/legal/schema/dto/provision-entry.dto.ts";
import { provisionEntryExample } from "@test/modules/legal/schema/dto/examples/provision-entry.dto.example.ts";

/** Managed by Dryv: ProvisionEntryDto enforces exactly what the ProvisionEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ProvisionEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = provisionEntryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ProvisionEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(provisionEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...provisionEntryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
