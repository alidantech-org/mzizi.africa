import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PublicServiceResponseDto } from "#/modules/services/dto/public-service-response.dto.ts";
import { publicServiceResponseExample } from "#/modules/services/dto/public-service-response.dto.example.ts";

/** Managed by Dryv: PublicServiceResponseDto enforces exactly what the PublicServiceResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PublicServiceResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = publicServiceResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PublicServiceResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(publicServiceResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...publicServiceResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});