import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { VoteCollectionDto } from "#/modules/legislature/schema/dto/vote-collection.dto.ts";
import { voteCollectionExample } from "@test/modules/legislature/schema/dto/examples/vote-collection.dto.example.ts";

/** Managed by Dryv: VoteCollectionDto enforces exactly what the VoteCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(VoteCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = voteCollectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("VoteCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(voteCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...voteCollectionExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
