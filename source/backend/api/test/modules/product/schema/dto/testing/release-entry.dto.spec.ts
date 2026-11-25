import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ReleaseEntryDto } from "#/modules/product/schema/dto/release-entry.dto.ts";
import { releaseEntryExample } from "@test/modules/product/schema/dto/examples/release-entry.dto.example.ts";

/** Managed by Dryv: ReleaseEntryDto enforces exactly what the ReleaseEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ReleaseEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = releaseEntryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ReleaseEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(releaseEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...releaseEntryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
