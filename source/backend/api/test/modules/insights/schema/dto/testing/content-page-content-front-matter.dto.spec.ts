import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ContentPageContentFrontMatterDto } from "#/modules/insights/schema/dto/content-page-content-front-matter.dto.ts";
import { contentPageContentFrontMatterExample } from "@test/modules/insights/schema/dto/examples/content-page-content-front-matter.dto.example.ts";

/** Managed by Dryv: ContentPageContentFrontMatterDto enforces exactly what the ContentPageContentFrontMatter contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ContentPageContentFrontMatterDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = contentPageContentFrontMatterExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ContentPageContentFrontMatterDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(contentPageContentFrontMatterExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...contentPageContentFrontMatterExample.valid(),
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
