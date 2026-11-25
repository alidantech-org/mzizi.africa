import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ReleaseWindowDto } from "#/modules/product/schema/dto/release-window.dto.ts";
import { releaseWindowExample } from "@test/modules/product/schema/dto/examples/release-window.dto.example.ts";

/** Managed by Dryv: ReleaseWindowDto enforces exactly what the ReleaseWindow contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ReleaseWindowDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = releaseWindowExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ReleaseWindowDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(releaseWindowExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...releaseWindowExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
