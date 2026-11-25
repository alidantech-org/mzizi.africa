import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ElectionCollectionDto } from "#/modules/election/schema/dto/election-collection.dto.ts";
import { electionCollectionExample } from "@test/modules/election/schema/dto/examples/election-collection.dto.example.ts";

/** Managed by Dryv: ElectionCollectionDto enforces exactly what the ElectionCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ElectionCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = electionCollectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ElectionCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(electionCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...electionCollectionExample.valid(),
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
