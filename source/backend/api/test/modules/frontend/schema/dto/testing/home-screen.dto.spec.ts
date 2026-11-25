import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { HomeScreenDto } from "#/modules/frontend/schema/dto/home-screen.dto.ts";
import { homeScreenExample } from "@test/modules/frontend/schema/dto/examples/home-screen.dto.example.ts";

/** Managed by Dryv: HomeScreenDto enforces exactly what the HomeScreen contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(HomeScreenDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = homeScreenExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("HomeScreenDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(homeScreenExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...homeScreenExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
