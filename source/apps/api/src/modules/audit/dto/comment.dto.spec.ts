import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CommentDto } from "#/modules/audit/dto/comment.dto.ts";
import { commentExample } from "#/modules/audit/dto/comment.dto.example.ts";

/** Managed by Dryv: CommentDto enforces exactly what the Comment contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CommentDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = commentExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("CommentDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(commentExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...commentExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});