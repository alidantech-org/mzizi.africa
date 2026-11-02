import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ServiceDeliveryResponseDto } from "#/modules/services/dto/service-delivery-response.dto.ts";
import { serviceDeliveryResponseExample } from "#/modules/services/dto/service-delivery-response.dto.example.ts";

/** Managed by Dryv: ServiceDeliveryResponseDto enforces exactly what the ServiceDeliveryResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ServiceDeliveryResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = serviceDeliveryResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ServiceDeliveryResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(serviceDeliveryResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...serviceDeliveryResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});