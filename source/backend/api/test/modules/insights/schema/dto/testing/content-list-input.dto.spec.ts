import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ContentListInputDto } from "#/modules/insights/schema/dto/content-list-input.dto.ts";
import { contentListInputExample } from "@test/modules/insights/schema/dto/examples/content-list-input.dto.example.ts";

/** Managed by Dryv: ContentListInputDto enforces exactly what the ContentListInput contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ContentListInputDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = contentListInputExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ContentListInputDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(contentListInputExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...contentListInputExample.valid(),
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
