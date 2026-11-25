import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { OfficeDetailNamesDto } from "#/modules/governance/schema/dto/office-detail-names.dto.ts";
import { officeDetailNamesExample } from "@test/modules/governance/schema/dto/examples/office-detail-names.dto.example.ts";

/** Managed by Dryv: OfficeDetailNamesDto enforces exactly what the OfficeDetailNames contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(OfficeDetailNamesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = officeDetailNamesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("OfficeDetailNamesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(officeDetailNamesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...officeDetailNamesExample.valid(),
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
