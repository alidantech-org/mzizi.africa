import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ContentPageRelatedCategoryDto } from "#/modules/insights/schema/dto/content-page-related-category.dto.ts";
import { contentPageRelatedCategoryExample } from "@test/modules/insights/schema/dto/examples/content-page-related-category.dto.example.ts";

/** Managed by Dryv: ContentPageRelatedCategoryDto enforces exactly what the ContentPageRelatedCategory contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ContentPageRelatedCategoryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = contentPageRelatedCategoryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ContentPageRelatedCategoryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(contentPageRelatedCategoryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...contentPageRelatedCategoryExample.valid(),
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
