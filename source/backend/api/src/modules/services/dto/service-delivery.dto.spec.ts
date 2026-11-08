import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ServiceDeliveryDto } from "#/modules/services/dto/service-delivery.dto.ts";
import { serviceDeliveryExample } from "#/modules/services/dto/service-delivery.dto.example.ts";

/** Managed by Dryv: ServiceDeliveryDto enforces exactly what the ServiceDelivery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ServiceDeliveryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = serviceDeliveryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ServiceDeliveryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(serviceDeliveryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...serviceDeliveryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});