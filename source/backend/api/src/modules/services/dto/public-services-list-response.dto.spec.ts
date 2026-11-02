import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PublicServicesListResponseDto } from "#/modules/services/dto/public-services-list-response.dto.ts";
import { publicServicesListResponseExample } from "#/modules/services/dto/public-services-list-response.dto.example.ts";

/** Managed by Dryv: PublicServicesListResponseDto enforces exactly what the PublicServicesListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PublicServicesListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = publicServicesListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PublicServicesListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(publicServicesListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...publicServicesListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});