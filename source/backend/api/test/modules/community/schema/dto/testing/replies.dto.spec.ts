import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { RepliesDto } from "#/modules/community/schema/dto/replies.dto.ts";
import { repliesExample } from "@test/modules/community/schema/dto/examples/replies.dto.example.ts";

/** Managed by Dryv: RepliesDto enforces exactly what the Replies contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(RepliesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = repliesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("RepliesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(repliesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...repliesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
