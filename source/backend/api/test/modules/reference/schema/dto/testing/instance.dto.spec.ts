import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstanceDto } from "#/modules/reference/schema/dto/instance.dto.ts";
import { instanceExample } from "@test/modules/reference/schema/dto/examples/instance.dto.example.ts";

/** Managed by Dryv: InstanceDto enforces exactly what the Instance contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstanceDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = instanceExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("InstanceDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(instanceExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...instanceExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
