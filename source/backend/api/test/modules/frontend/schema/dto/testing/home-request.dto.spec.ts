import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { HomeRequestDto } from "#/modules/frontend/schema/dto/home-request.dto.ts";
import { homeRequestExample } from "@test/modules/frontend/schema/dto/examples/home-request.dto.example.ts";

/** Managed by Dryv: HomeRequestDto enforces exactly what the HomeRequest contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(HomeRequestDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = homeRequestExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("HomeRequestDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(homeRequestExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...homeRequestExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
