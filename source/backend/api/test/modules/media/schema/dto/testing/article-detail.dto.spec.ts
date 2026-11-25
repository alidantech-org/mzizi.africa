import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ArticleDetailDto } from "#/modules/media/schema/dto/article-detail.dto.ts";
import { articleDetailExample } from "@test/modules/media/schema/dto/examples/article-detail.dto.example.ts";

/** Managed by Dryv: ArticleDetailDto enforces exactly what the ArticleDetail contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ArticleDetailDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = articleDetailExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ArticleDetailDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(articleDetailExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...articleDetailExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
