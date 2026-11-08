import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ServiceDeliveriesListResponseDto } from "#/modules/services/dto/service-deliveries-list-response.dto.ts";
import { serviceDeliveriesListResponseExample } from "#/modules/services/dto/service-deliveries-list-response.dto.example.ts";

/** Managed by Dryv: ServiceDeliveriesListResponseDto enforces exactly what the ServiceDeliveriesListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ServiceDeliveriesListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = serviceDeliveriesListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ServiceDeliveriesListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(serviceDeliveriesListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...serviceDeliveriesListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});