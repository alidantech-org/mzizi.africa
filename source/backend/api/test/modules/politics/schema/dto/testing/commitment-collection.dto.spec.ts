import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CommitmentCollectionDto } from "#/modules/politics/schema/dto/commitment-collection.dto.ts";
import { commitmentCollectionExample } from "@test/modules/politics/schema/dto/examples/commitment-collection.dto.example.ts";

/** Managed by Dryv: CommitmentCollectionDto enforces exactly what the CommitmentCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CommitmentCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = commitmentCollectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CommitmentCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(commitmentCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...commitmentCollectionExample.valid(),
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
