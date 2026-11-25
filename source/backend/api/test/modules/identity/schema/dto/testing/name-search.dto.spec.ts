import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { NameSearchDto } from "#/modules/identity/schema/dto/name-search.dto.ts";
import { nameSearchExample } from "@test/modules/identity/schema/dto/examples/name-search.dto.example.ts";

/** Managed by Dryv: NameSearchDto enforces exactly what the NameSearch contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(NameSearchDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = nameSearchExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("NameSearchDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(nameSearchExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...nameSearchExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
