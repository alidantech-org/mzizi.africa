import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ComponentsDto } from "#/modules/statistics/schema/dto/components.dto.ts";
import { componentsExample } from "@test/modules/statistics/schema/dto/examples/components.dto.example.ts";

/** Managed by Dryv: ComponentsDto enforces exactly what the Components contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ComponentsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = componentsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ComponentsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(componentsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...componentsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
