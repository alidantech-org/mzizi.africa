import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CommentListQueryDto } from "#/modules/audit/dto/comment-list-query.dto.ts";
import { commentListQueryExample } from "#/modules/audit/dto/comment-list-query.dto.example.ts";

/** Managed by Dryv: CommentListQueryDto enforces exactly what the CommentListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CommentListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = commentListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("CommentListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(commentListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...commentListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});