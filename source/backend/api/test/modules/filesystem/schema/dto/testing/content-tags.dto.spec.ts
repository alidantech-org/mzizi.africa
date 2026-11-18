import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ContentTagsDto } from "#/modules/filesystem/schema/dto/content-tags.dto.ts";
import { contentTagsExample } from "@test/modules/filesystem/schema/dto/examples/content-tags.dto.example.ts";

/** Managed by Dryv: ContentTagsDto enforces exactly what the ContentTags contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ContentTagsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = contentTagsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ContentTagsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(contentTagsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...contentTagsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
