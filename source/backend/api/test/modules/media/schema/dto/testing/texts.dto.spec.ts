import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { TextsDto } from "#/modules/media/schema/dto/texts.dto.ts";
import { textsExample } from "@test/modules/media/schema/dto/examples/texts.dto.example.ts";

/** Managed by Dryv: TextsDto enforces exactly what the Texts contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(TextsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = textsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("TextsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(textsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...textsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
