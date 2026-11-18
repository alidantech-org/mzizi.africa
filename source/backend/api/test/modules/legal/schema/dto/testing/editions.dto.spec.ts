import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { EditionsDto } from "#/modules/legal/schema/dto/editions.dto.ts";
import { editionsExample } from "@test/modules/legal/schema/dto/examples/editions.dto.example.ts";

/** Managed by Dryv: EditionsDto enforces exactly what the Editions contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(EditionsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = editionsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("EditionsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(editionsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...editionsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
