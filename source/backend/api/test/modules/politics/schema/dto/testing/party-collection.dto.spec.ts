import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PartyCollectionDto } from "#/modules/politics/schema/dto/party-collection.dto.ts";
import { partyCollectionExample } from "@test/modules/politics/schema/dto/examples/party-collection.dto.example.ts";

/** Managed by Dryv: PartyCollectionDto enforces exactly what the PartyCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PartyCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = partyCollectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PartyCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(partyCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...partyCollectionExample.valid(),
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
