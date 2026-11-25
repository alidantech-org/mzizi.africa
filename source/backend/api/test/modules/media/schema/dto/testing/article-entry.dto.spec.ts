import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ArticleEntryDto } from "#/modules/media/schema/dto/article-entry.dto.ts";
import { articleEntryExample } from "@test/modules/media/schema/dto/examples/article-entry.dto.example.ts";

/** Managed by Dryv: ArticleEntryDto enforces exactly what the ArticleEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ArticleEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = articleEntryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ArticleEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(articleEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...articleEntryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
