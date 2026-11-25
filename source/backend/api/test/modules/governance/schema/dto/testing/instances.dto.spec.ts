import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstancesDto } from "#/modules/governance/schema/dto/instances.dto.ts";
import { instancesExample } from "@test/modules/governance/schema/dto/examples/instances.dto.example.ts";

/** Managed by Dryv: InstancesDto enforces exactly what the Instances contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstancesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = instancesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("InstancesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(instancesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...instancesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
