import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { TallyCollectionDto } from "#/modules/election/schema/dto/tally-collection.dto.ts";
import { tallyCollectionExample } from "@test/modules/election/schema/dto/examples/tally-collection.dto.example.ts";

/** Managed by Dryv: TallyCollectionDto enforces exactly what the TallyCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(TallyCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = tallyCollectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("TallyCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(tallyCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...tallyCollectionExample.valid(),
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
