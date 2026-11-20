import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { NavigationItemDto } from "#/modules/explorer/schema/dto/navigation-item.dto.ts";
import { navigationItemExample } from "@test/modules/explorer/schema/dto/examples/navigation-item.dto.example.ts";

/** Managed by Dryv: NavigationItemDto enforces exactly what the NavigationItem contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(NavigationItemDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = navigationItemExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("NavigationItemDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(navigationItemExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...navigationItemExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
