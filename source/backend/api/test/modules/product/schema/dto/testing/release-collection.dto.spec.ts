import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ReleaseCollectionDto } from "#/modules/product/schema/dto/release-collection.dto.ts";
import { releaseCollectionExample } from "@test/modules/product/schema/dto/examples/release-collection.dto.example.ts";

/** Managed by Dryv: ReleaseCollectionDto enforces exactly what the ReleaseCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ReleaseCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = releaseCollectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ReleaseCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(releaseCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...releaseCollectionExample.valid(),
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
