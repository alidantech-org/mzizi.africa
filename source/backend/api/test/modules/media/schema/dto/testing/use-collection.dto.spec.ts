import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { UseCollectionDto } from "#/modules/media/schema/dto/use-collection.dto.ts";
import { useCollectionExample } from "@test/modules/media/schema/dto/examples/use-collection.dto.example.ts";

/** Managed by Dryv: UseCollectionDto enforces exactly what the UseCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(UseCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = useCollectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("UseCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(useCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...useCollectionExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
