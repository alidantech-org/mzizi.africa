import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { BootstrapDto } from "#/modules/explorer/schema/dto/bootstrap.dto.ts";
import { bootstrapExample } from "@test/modules/explorer/schema/dto/examples/bootstrap.dto.example.ts";

/** Managed by Dryv: BootstrapDto enforces exactly what the Bootstrap contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(BootstrapDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = bootstrapExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("BootstrapDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(bootstrapExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...bootstrapExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
