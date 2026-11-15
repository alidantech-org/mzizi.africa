import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { OfficeDetailDto } from "#/modules/governance/schema/dto/office-detail.dto.ts";
import { officeDetailExample } from "@test/modules/governance/schema/dto/examples/office-detail.dto.example.ts";

/** Managed by Dryv: OfficeDetailDto enforces exactly what the OfficeDetail contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(OfficeDetailDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = officeDetailExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("OfficeDetailDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(officeDetailExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...officeDetailExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
