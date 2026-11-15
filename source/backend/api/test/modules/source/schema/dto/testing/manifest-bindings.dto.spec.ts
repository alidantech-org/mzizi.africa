import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ManifestBindingsDto } from "#/modules/source/schema/dto/manifest-bindings.dto.ts";
import { manifestBindingsExample } from "@test/modules/source/schema/dto/examples/manifest-bindings.dto.example.ts";

/** Managed by Dryv: ManifestBindingsDto enforces exactly what the ManifestBindings contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ManifestBindingsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = manifestBindingsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ManifestBindingsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(manifestBindingsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...manifestBindingsExample.valid(),
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
