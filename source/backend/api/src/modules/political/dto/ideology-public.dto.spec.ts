import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IdeologyPublicDto } from "#/modules/political/dto/ideology-public.dto.ts";
import { ideologyPublicExample } from "#/modules/political/dto/ideology-public.dto.example.ts";

/** Managed by Dryv: IdeologyPublicDto enforces exactly what the IdeologyPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IdeologyPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = ideologyPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("IdeologyPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(ideologyPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...ideologyPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});