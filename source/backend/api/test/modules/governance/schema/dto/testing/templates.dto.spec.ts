import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { TemplatesDto } from "#/modules/governance/schema/dto/templates.dto.ts";
import { templatesExample } from "@test/modules/governance/schema/dto/examples/templates.dto.example.ts";

/** Managed by Dryv: TemplatesDto enforces exactly what the Templates contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(TemplatesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = templatesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("TemplatesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(templatesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...templatesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
