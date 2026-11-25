import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ViewsDto } from "#/modules/community/schema/dto/views.dto.ts";
import { viewsExample } from "@test/modules/community/schema/dto/examples/views.dto.example.ts";

/** Managed by Dryv: ViewsDto enforces exactly what the Views contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ViewsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = viewsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ViewsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(viewsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...viewsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
