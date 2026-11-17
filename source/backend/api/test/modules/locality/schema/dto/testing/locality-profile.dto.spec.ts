import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LocalityProfileDto } from "#/modules/locality/schema/dto/locality-profile.dto.ts";
import { localityProfileExample } from "@test/modules/locality/schema/dto/examples/locality-profile.dto.example.ts";

/** Managed by Dryv: LocalityProfileDto enforces exactly what the LocalityProfile contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LocalityProfileDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = localityProfileExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LocalityProfileDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(localityProfileExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...localityProfileExample.valid(),
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
