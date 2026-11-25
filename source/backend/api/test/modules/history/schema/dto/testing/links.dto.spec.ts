import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LinksDto } from "#/modules/history/schema/dto/links.dto.ts";
import { linksExample } from "@test/modules/history/schema/dto/examples/links.dto.example.ts";

/** Managed by Dryv: LinksDto enforces exactly what the Links contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LinksDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = linksExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LinksDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(linksExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...linksExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
