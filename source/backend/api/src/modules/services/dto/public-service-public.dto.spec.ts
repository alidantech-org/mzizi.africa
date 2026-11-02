import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PublicServicePublicDto } from "#/modules/services/dto/public-service-public.dto.ts";
import { publicServicePublicExample } from "#/modules/services/dto/public-service-public.dto.example.ts";

/** Managed by Dryv: PublicServicePublicDto enforces exactly what the PublicServicePublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PublicServicePublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = publicServicePublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PublicServicePublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(publicServicePublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...publicServicePublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});