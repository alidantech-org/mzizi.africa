import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { DevicesDto } from "#/modules/community/schema/dto/devices.dto.ts";
import { devicesExample } from "@test/modules/community/schema/dto/examples/devices.dto.example.ts";

/** Managed by Dryv: DevicesDto enforces exactly what the Devices contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(DevicesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = devicesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("DevicesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(devicesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...devicesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
