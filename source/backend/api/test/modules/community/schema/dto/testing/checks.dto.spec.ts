import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ChecksDto } from "#/modules/community/schema/dto/checks.dto.ts";
import { checksExample } from "@test/modules/community/schema/dto/examples/checks.dto.example.ts";

/** Managed by Dryv: ChecksDto enforces exactly what the Checks contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ChecksDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = checksExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ChecksDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(checksExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...checksExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
