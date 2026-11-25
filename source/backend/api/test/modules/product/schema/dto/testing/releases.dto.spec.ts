import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ReleasesDto } from "#/modules/product/schema/dto/releases.dto.ts";
import { releasesExample } from "@test/modules/product/schema/dto/examples/releases.dto.example.ts";

/** Managed by Dryv: ReleasesDto enforces exactly what the Releases contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ReleasesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = releasesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ReleasesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(releasesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...releasesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
