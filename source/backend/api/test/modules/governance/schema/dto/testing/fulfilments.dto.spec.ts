import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FulfilmentsDto } from "#/modules/governance/schema/dto/fulfilments.dto.ts";
import { fulfilmentsExample } from "@test/modules/governance/schema/dto/examples/fulfilments.dto.example.ts";

/** Managed by Dryv: FulfilmentsDto enforces exactly what the Fulfilments contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FulfilmentsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = fulfilmentsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("FulfilmentsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(fulfilmentsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...fulfilmentsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
