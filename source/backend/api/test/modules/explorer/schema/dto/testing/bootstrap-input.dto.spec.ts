import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { BootstrapInputDto } from "#/modules/explorer/schema/dto/bootstrap-input.dto.ts";
import { bootstrapInputExample } from "@test/modules/explorer/schema/dto/examples/bootstrap-input.dto.example.ts";

/** Managed by Dryv: BootstrapInputDto enforces exactly what the BootstrapInput contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(BootstrapInputDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = bootstrapInputExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("BootstrapInputDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(bootstrapInputExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...bootstrapInputExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
