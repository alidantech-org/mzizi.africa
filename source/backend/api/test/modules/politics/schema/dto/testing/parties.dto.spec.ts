import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PartiesDto } from "#/modules/politics/schema/dto/parties.dto.ts";
import { partiesExample } from "@test/modules/politics/schema/dto/examples/parties.dto.example.ts";

/** Managed by Dryv: PartiesDto enforces exactly what the Parties contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PartiesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = partiesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PartiesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(partiesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...partiesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
