import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ProofsDto } from "#/modules/community/schema/dto/proofs.dto.ts";
import { proofsExample } from "@test/modules/community/schema/dto/examples/proofs.dto.example.ts";

/** Managed by Dryv: ProofsDto enforces exactly what the Proofs contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ProofsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = proofsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ProofsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(proofsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...proofsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
