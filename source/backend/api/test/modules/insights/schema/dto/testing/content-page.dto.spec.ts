import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ContentPageDto } from "#/modules/insights/schema/dto/content-page.dto.ts";
import { contentPageExample } from "@test/modules/insights/schema/dto/examples/content-page.dto.example.ts";

/** Managed by Dryv: ContentPageDto enforces exactly what the ContentPage contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ContentPageDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = contentPageExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ContentPageDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(contentPageExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...contentPageExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
