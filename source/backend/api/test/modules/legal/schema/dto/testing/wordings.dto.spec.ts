import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { WordingsDto } from "#/modules/legal/schema/dto/wordings.dto.ts";
import { wordingsExample } from "@test/modules/legal/schema/dto/examples/wordings.dto.example.ts";

/** Managed by Dryv: WordingsDto enforces exactly what the Wordings contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(WordingsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = wordingsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("WordingsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(wordingsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...wordingsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
