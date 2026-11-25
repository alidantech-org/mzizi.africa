import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FormsDto } from "#/modules/election/schema/dto/forms.dto.ts";
import { formsExample } from "@test/modules/election/schema/dto/examples/forms.dto.example.ts";

/** Managed by Dryv: FormsDto enforces exactly what the Forms contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FormsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = formsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("FormsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(formsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...formsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
