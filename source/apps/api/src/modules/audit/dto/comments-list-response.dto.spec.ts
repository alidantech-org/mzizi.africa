import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CommentsListResponseDto } from "#/modules/audit/dto/comments-list-response.dto.ts";
import { commentsListResponseExample } from "#/modules/audit/dto/comments-list-response.dto.example.ts";

/** Managed by Dryv: CommentsListResponseDto enforces exactly what the CommentsListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CommentsListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = commentsListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("CommentsListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(commentsListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...commentsListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});