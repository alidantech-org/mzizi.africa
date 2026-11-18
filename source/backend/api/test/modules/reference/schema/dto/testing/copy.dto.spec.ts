import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CopyDto } from "#/modules/reference/schema/dto/copy.dto.ts";
import { copyExample } from "@test/modules/reference/schema/dto/examples/copy.dto.example.ts";

/** Managed by Dryv: CopyDto enforces exactly what the Copy contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CopyDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = copyExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CopyDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(copyExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...copyExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
