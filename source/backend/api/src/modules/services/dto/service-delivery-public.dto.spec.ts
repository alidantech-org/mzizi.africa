import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ServiceDeliveryPublicDto } from "#/modules/services/dto/service-delivery-public.dto.ts";
import { serviceDeliveryPublicExample } from "#/modules/services/dto/service-delivery-public.dto.example.ts";

/** Managed by Dryv: ServiceDeliveryPublicDto enforces exactly what the ServiceDeliveryPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ServiceDeliveryPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = serviceDeliveryPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ServiceDeliveryPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(serviceDeliveryPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...serviceDeliveryPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});