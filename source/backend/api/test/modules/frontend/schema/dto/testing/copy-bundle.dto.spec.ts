import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CopyBundleDto } from "#/modules/frontend/schema/dto/copy-bundle.dto.ts";
import { copyBundleExample } from "@test/modules/frontend/schema/dto/examples/copy-bundle.dto.example.ts";

/** Managed by Dryv: CopyBundleDto enforces exactly what the CopyBundle contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CopyBundleDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = copyBundleExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CopyBundleDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(copyBundleExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...copyBundleExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
