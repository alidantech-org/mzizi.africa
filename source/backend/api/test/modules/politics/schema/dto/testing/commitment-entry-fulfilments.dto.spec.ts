import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CommitmentEntryFulfilmentsDto } from "#/modules/politics/schema/dto/commitment-entry-fulfilments.dto.ts";
import { commitmentEntryFulfilmentsExample } from "@test/modules/politics/schema/dto/examples/commitment-entry-fulfilments.dto.example.ts";

/** Managed by Dryv: CommitmentEntryFulfilmentsDto enforces exactly what the CommitmentEntryFulfilments contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CommitmentEntryFulfilmentsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = commitmentEntryFulfilmentsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CommitmentEntryFulfilmentsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(commitmentEntryFulfilmentsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...commitmentEntryFulfilmentsExample.valid(),
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
