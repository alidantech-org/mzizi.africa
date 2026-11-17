import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CodedPeriodEntityDto } from "#/modules/shared/schema/dto/coded-period-entity.dto.ts";
import { codedPeriodEntityExample } from "@test/modules/shared/schema/dto/examples/coded-period-entity.dto.example.ts";

/** Managed by Dryv: CodedPeriodEntityDto enforces exactly what the CodedPeriodEntity contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CodedPeriodEntityDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = codedPeriodEntityExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CodedPeriodEntityDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(codedPeriodEntityExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...codedPeriodEntityExample.valid(),
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
