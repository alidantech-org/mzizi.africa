import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ServicesDto } from "#/modules/civic/schema/dto/services.dto.ts";
import { servicesExample } from "@test/modules/civic/schema/dto/examples/services.dto.example.ts";

/** Managed by Dryv: ServicesDto enforces exactly what the Services contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ServicesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = servicesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ServicesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(servicesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...servicesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
