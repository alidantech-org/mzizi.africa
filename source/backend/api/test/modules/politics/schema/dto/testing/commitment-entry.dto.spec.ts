import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CommitmentEntryDto } from "#/modules/politics/schema/dto/commitment-entry.dto.ts";
import { commitmentEntryExample } from "@test/modules/politics/schema/dto/examples/commitment-entry.dto.example.ts";

/** Managed by Dryv: CommitmentEntryDto enforces exactly what the CommitmentEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CommitmentEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = commitmentEntryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CommitmentEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(commitmentEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...commitmentEntryExample.valid(),
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
