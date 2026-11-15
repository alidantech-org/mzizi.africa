import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { OfficeDetailHoldersDto } from "#/modules/governance/schema/dto/office-detail-holders.dto.ts";
import { officeDetailHoldersExample } from "@test/modules/governance/schema/dto/examples/office-detail-holders.dto.example.ts";

/** Managed by Dryv: OfficeDetailHoldersDto enforces exactly what the OfficeDetailHolders contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(OfficeDetailHoldersDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = officeDetailHoldersExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("OfficeDetailHoldersDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(officeDetailHoldersExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...officeDetailHoldersExample.valid(),
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
