import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ContentPageContentDto } from "#/modules/insights/schema/dto/content-page-content.dto.ts";
import { contentPageContentExample } from "@test/modules/insights/schema/dto/examples/content-page-content.dto.example.ts";

/** Managed by Dryv: ContentPageContentDto enforces exactly what the ContentPageContent contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ContentPageContentDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = contentPageContentExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ContentPageContentDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(contentPageContentExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...contentPageContentExample.valid(),
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
