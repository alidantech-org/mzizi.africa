import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { NavigationDto } from "#/modules/explorer/schema/dto/navigation.dto.ts";
import { navigationExample } from "@test/modules/explorer/schema/dto/examples/navigation.dto.example.ts";

/** Managed by Dryv: NavigationDto enforces exactly what the Navigation contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(NavigationDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = navigationExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("NavigationDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(navigationExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...navigationExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
