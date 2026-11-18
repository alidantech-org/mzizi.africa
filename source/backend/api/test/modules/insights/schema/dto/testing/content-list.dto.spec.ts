import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ContentListDto } from "#/modules/insights/schema/dto/content-list.dto.ts";
import { contentListExample } from "@test/modules/insights/schema/dto/examples/content-list.dto.example.ts";

/** Managed by Dryv: ContentListDto enforces exactly what the ContentList contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ContentListDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = contentListExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ContentListDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(contentListExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...contentListExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
