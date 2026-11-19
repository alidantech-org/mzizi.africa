import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { TemplateDto } from "#/modules/reference/schema/dto/template.dto.ts";
import { templateExample } from "@test/modules/reference/schema/dto/examples/template.dto.example.ts";

/** Managed by Dryv: TemplateDto enforces exactly what the Template contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(TemplateDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = templateExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("TemplateDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(templateExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...templateExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
