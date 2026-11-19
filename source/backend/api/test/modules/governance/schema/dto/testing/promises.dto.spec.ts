import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PromisesDto } from "#/modules/governance/schema/dto/promises.dto.ts";
import { promisesExample } from "@test/modules/governance/schema/dto/examples/promises.dto.example.ts";

/** Managed by Dryv: PromisesDto enforces exactly what the Promises contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PromisesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = promisesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PromisesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(promisesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...promisesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
