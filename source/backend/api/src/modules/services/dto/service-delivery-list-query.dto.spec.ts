import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ServiceDeliveryListQueryDto } from "#/modules/services/dto/service-delivery-list-query.dto.ts";
import { serviceDeliveryListQueryExample } from "#/modules/services/dto/service-delivery-list-query.dto.example.ts";

/** Managed by Dryv: ServiceDeliveryListQueryDto enforces exactly what the ServiceDeliveryListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ServiceDeliveryListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = serviceDeliveryListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ServiceDeliveryListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(serviceDeliveryListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...serviceDeliveryListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});