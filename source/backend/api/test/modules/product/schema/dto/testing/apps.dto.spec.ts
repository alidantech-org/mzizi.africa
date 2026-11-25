import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { AppsDto } from "#/modules/product/schema/dto/apps.dto.ts";
import { appsExample } from "@test/modules/product/schema/dto/examples/apps.dto.example.ts";

/** Managed by Dryv: AppsDto enforces exactly what the Apps contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(AppsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = appsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("AppsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(appsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...appsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
