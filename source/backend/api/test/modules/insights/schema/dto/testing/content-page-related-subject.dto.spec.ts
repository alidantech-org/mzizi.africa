import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ContentPageRelatedSubjectDto } from "#/modules/insights/schema/dto/content-page-related-subject.dto.ts";
import { contentPageRelatedSubjectExample } from "@test/modules/insights/schema/dto/examples/content-page-related-subject.dto.example.ts";

/** Managed by Dryv: ContentPageRelatedSubjectDto enforces exactly what the ContentPageRelatedSubject contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ContentPageRelatedSubjectDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = contentPageRelatedSubjectExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ContentPageRelatedSubjectDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(contentPageRelatedSubjectExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...contentPageRelatedSubjectExample.valid(),
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
