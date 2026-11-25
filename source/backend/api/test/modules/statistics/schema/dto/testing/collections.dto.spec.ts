import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CollectionsDto } from "#/modules/statistics/schema/dto/collections.dto.ts";
import { collectionsExample } from "@test/modules/statistics/schema/dto/examples/collections.dto.example.ts";

/** Managed by Dryv: CollectionsDto enforces exactly what the Collections contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CollectionsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = collectionsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CollectionsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(collectionsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...collectionsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
