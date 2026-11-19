import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ContentListItemsFrontMatterDto } from "#/modules/insights/schema/dto/content-list-items-front-matter.dto.ts";
import { contentListItemsFrontMatterExample } from "@test/modules/insights/schema/dto/examples/content-list-items-front-matter.dto.example.ts";

/** Managed by Dryv: ContentListItemsFrontMatterDto enforces exactly what the ContentListItemsFrontMatter contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ContentListItemsFrontMatterDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = contentListItemsFrontMatterExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ContentListItemsFrontMatterDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(contentListItemsFrontMatterExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...contentListItemsFrontMatterExample.valid(),
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
