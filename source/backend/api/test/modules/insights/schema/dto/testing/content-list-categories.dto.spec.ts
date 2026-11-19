import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ContentListCategoriesDto } from "#/modules/insights/schema/dto/content-list-categories.dto.ts";
import { contentListCategoriesExample } from "@test/modules/insights/schema/dto/examples/content-list-categories.dto.example.ts";

/** Managed by Dryv: ContentListCategoriesDto enforces exactly what the ContentListCategories contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ContentListCategoriesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = contentListCategoriesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ContentListCategoriesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(contentListCategoriesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...contentListCategoriesExample.valid(),
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
