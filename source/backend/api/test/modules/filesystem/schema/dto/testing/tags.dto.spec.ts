import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { TagsDto } from "#/modules/filesystem/schema/dto/tags.dto.ts";
import { tagsExample } from "@test/modules/filesystem/schema/dto/examples/tags.dto.example.ts";

/** Managed by Dryv: TagsDto enforces exactly what the Tags contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(TagsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = tagsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("TagsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(tagsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...tagsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
