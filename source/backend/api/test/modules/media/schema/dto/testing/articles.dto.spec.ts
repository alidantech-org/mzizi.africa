import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ArticlesDto } from "#/modules/media/schema/dto/articles.dto.ts";
import { articlesExample } from "@test/modules/media/schema/dto/examples/articles.dto.example.ts";

/** Managed by Dryv: ArticlesDto enforces exactly what the Articles contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ArticlesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = articlesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ArticlesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(articlesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...articlesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
