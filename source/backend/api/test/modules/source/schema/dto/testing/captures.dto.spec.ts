import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CapturesDto } from "#/modules/source/schema/dto/captures.dto.ts";
import { capturesExample } from "@test/modules/source/schema/dto/examples/captures.dto.example.ts";

/** Managed by Dryv: CapturesDto enforces exactly what the Captures contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CapturesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = capturesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CapturesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(capturesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...capturesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
