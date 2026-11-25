import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IdentityPostsDto } from "#/modules/community/schema/dto/identity-posts.dto.ts";
import { identityPostsExample } from "@test/modules/community/schema/dto/examples/identity-posts.dto.example.ts";

/** Managed by Dryv: IdentityPostsDto enforces exactly what the IdentityPosts contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IdentityPostsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = identityPostsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("IdentityPostsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(identityPostsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...identityPostsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
