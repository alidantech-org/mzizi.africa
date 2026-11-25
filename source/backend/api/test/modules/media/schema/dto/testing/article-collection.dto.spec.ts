import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ArticleCollectionDto } from "#/modules/media/schema/dto/article-collection.dto.ts";
import { articleCollectionExample } from "@test/modules/media/schema/dto/examples/article-collection.dto.example.ts";

/** Managed by Dryv: ArticleCollectionDto enforces exactly what the ArticleCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ArticleCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = articleCollectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ArticleCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(articleCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...articleCollectionExample.valid(),
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
