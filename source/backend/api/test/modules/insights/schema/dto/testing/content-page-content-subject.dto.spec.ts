import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ContentPageContentSubjectDto } from "#/modules/insights/schema/dto/content-page-content-subject.dto.ts";
import { contentPageContentSubjectExample } from "@test/modules/insights/schema/dto/examples/content-page-content-subject.dto.example.ts";

/** Managed by Dryv: ContentPageContentSubjectDto enforces exactly what the ContentPageContentSubject contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ContentPageContentSubjectDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = contentPageContentSubjectExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ContentPageContentSubjectDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(contentPageContentSubjectExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...contentPageContentSubjectExample.valid(),
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
