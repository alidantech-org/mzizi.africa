import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ArticleEntryTitlesDto } from "#/modules/media/schema/dto/article-entry-titles.dto.ts";
import { articleEntryTitlesExample } from "@test/modules/media/schema/dto/examples/article-entry-titles.dto.example.ts";

/** Managed by Dryv: ArticleEntryTitlesDto enforces exactly what the ArticleEntryTitles contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ArticleEntryTitlesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = articleEntryTitlesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ArticleEntryTitlesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(articleEntryTitlesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...articleEntryTitlesExample.valid(),
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
