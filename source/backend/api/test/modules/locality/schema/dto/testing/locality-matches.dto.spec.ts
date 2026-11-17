import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LocalityMatchesDto } from "#/modules/locality/schema/dto/locality-matches.dto.ts";
import { localityMatchesExample } from "@test/modules/locality/schema/dto/examples/locality-matches.dto.example.ts";

/** Managed by Dryv: LocalityMatchesDto enforces exactly what the LocalityMatches contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LocalityMatchesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = localityMatchesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LocalityMatchesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(localityMatchesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...localityMatchesExample.valid(),
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
