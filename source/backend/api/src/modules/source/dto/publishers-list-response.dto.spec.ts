import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PublishersListResponseDto } from "#/modules/source/dto/publishers-list-response.dto.ts";
import { publishersListResponseExample } from "#/modules/source/dto/publishers-list-response.dto.example.ts";

/** Managed by Dryv: PublishersListResponseDto enforces exactly what the PublishersListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PublishersListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = publishersListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PublishersListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(publishersListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...publishersListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});