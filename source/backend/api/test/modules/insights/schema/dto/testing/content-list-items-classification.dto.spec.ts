import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ContentListItemsClassificationDto } from "#/modules/insights/schema/dto/content-list-items-classification.dto.ts";
import { contentListItemsClassificationExample } from "@test/modules/insights/schema/dto/examples/content-list-items-classification.dto.example.ts";

/** Managed by Dryv: ContentListItemsClassificationDto enforces exactly what the ContentListItemsClassification contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ContentListItemsClassificationDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = contentListItemsClassificationExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ContentListItemsClassificationDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(contentListItemsClassificationExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...contentListItemsClassificationExample.valid(),
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
