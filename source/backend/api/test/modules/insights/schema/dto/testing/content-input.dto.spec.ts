import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ContentInputDto } from "#/modules/insights/schema/dto/content-input.dto.ts";
import { contentInputExample } from "@test/modules/insights/schema/dto/examples/content-input.dto.example.ts";

/** Managed by Dryv: ContentInputDto enforces exactly what the ContentInput contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ContentInputDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = contentInputExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ContentInputDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(contentInputExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...contentInputExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
