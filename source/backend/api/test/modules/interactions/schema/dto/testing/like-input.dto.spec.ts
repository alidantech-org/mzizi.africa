import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LikeInputDto } from "#/modules/interactions/schema/dto/like-input.dto.ts";
import { likeInputExample } from "@test/modules/interactions/schema/dto/examples/like-input.dto.example.ts";

/** Managed by Dryv: LikeInputDto enforces exactly what the LikeInput contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LikeInputDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = likeInputExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LikeInputDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(likeInputExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...likeInputExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
