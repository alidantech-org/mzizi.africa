import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { VersionsDto } from "#/modules/filesystem/schema/dto/versions.dto.ts";
import { versionsExample } from "@test/modules/filesystem/schema/dto/examples/versions.dto.example.ts";

/** Managed by Dryv: VersionsDto enforces exactly what the Versions contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(VersionsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = versionsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("VersionsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(versionsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...versionsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
