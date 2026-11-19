import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ContentListItemsSubjectDto } from "#/modules/insights/schema/dto/content-list-items-subject.dto.ts";
import { contentListItemsSubjectExample } from "@test/modules/insights/schema/dto/examples/content-list-items-subject.dto.example.ts";

/** Managed by Dryv: ContentListItemsSubjectDto enforces exactly what the ContentListItemsSubject contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ContentListItemsSubjectDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = contentListItemsSubjectExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ContentListItemsSubjectDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(contentListItemsSubjectExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...contentListItemsSubjectExample.valid(),
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
