import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ArticleDetailTextsDto } from "#/modules/media/schema/dto/article-detail-texts.dto.ts";
import { articleDetailTextsExample } from "@test/modules/media/schema/dto/examples/article-detail-texts.dto.example.ts";

/** Managed by Dryv: ArticleDetailTextsDto enforces exactly what the ArticleDetailTexts contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ArticleDetailTextsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = articleDetailTextsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ArticleDetailTextsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(articleDetailTextsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...articleDetailTextsExample.valid(),
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
