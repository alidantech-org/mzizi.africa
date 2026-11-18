import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CopyEntryDto } from "#/modules/experience/schema/dto/copy-entry.dto.ts";
import { copyEntryExample } from "@test/modules/experience/schema/dto/examples/copy-entry.dto.example.ts";

/** Managed by Dryv: CopyEntryDto enforces exactly what the CopyEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CopyEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = copyEntryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CopyEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(copyEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...copyEntryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
