import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IdeologyListQueryDto } from "#/modules/political/dto/ideology-list-query.dto.ts";
import { ideologyListQueryExample } from "#/modules/political/dto/ideology-list-query.dto.example.ts";

/** Managed by Dryv: IdeologyListQueryDto enforces exactly what the IdeologyListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IdeologyListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = ideologyListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("IdeologyListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(ideologyListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...ideologyListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});