import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PostsDto } from "#/modules/community/schema/dto/posts.dto.ts";
import { postsExample } from "@test/modules/community/schema/dto/examples/posts.dto.example.ts";

/** Managed by Dryv: PostsDto enforces exactly what the Posts contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PostsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = postsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PostsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(postsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...postsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
