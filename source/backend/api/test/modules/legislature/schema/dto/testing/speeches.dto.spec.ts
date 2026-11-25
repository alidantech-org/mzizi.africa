import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SpeechesDto } from "#/modules/legislature/schema/dto/speeches.dto.ts";
import { speechesExample } from "@test/modules/legislature/schema/dto/examples/speeches.dto.example.ts";

/** Managed by Dryv: SpeechesDto enforces exactly what the Speeches contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SpeechesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = speechesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("SpeechesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(speechesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...speechesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
