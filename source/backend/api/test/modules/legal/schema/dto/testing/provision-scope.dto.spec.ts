import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ProvisionScopeDto } from "#/modules/legal/schema/dto/provision-scope.dto.ts";
import { provisionScopeExample } from "@test/modules/legal/schema/dto/examples/provision-scope.dto.example.ts";

/** Managed by Dryv: ProvisionScopeDto enforces exactly what the ProvisionScope contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ProvisionScopeDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = provisionScopeExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ProvisionScopeDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(provisionScopeExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...provisionScopeExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
