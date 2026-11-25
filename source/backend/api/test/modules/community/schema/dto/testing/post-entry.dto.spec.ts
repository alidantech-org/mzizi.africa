import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PostEntryDto } from "#/modules/community/schema/dto/post-entry.dto.ts";
import { postEntryExample } from "@test/modules/community/schema/dto/examples/post-entry.dto.example.ts";

/** Managed by Dryv: PostEntryDto enforces exactly what the PostEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PostEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = postEntryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PostEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(postEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...postEntryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
