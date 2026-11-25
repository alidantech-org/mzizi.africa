import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ProvisionEntryWordingsDto } from "#/modules/legal/schema/dto/provision-entry-wordings.dto.ts";
import { provisionEntryWordingsExample } from "@test/modules/legal/schema/dto/examples/provision-entry-wordings.dto.example.ts";

/** Managed by Dryv: ProvisionEntryWordingsDto enforces exactly what the ProvisionEntryWordings contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ProvisionEntryWordingsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = provisionEntryWordingsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ProvisionEntryWordingsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(provisionEntryWordingsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...provisionEntryWordingsExample.valid(),
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
