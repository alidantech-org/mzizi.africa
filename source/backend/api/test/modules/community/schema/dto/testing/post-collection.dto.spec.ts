import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PostCollectionDto } from "#/modules/community/schema/dto/post-collection.dto.ts";
import { postCollectionExample } from "@test/modules/community/schema/dto/examples/post-collection.dto.example.ts";

/** Managed by Dryv: PostCollectionDto enforces exactly what the PostCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PostCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = postCollectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PostCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(postCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...postCollectionExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
