import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { MediaRefDto } from "#/modules/locality/schema/dto/media-ref.dto.ts";
import { mediaRefExample } from "@test/modules/locality/schema/dto/examples/media-ref.dto.example.ts";

/** Managed by Dryv: MediaRefDto enforces exactly what the MediaRef contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(MediaRefDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = mediaRefExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("MediaRefDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(mediaRefExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...mediaRefExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
