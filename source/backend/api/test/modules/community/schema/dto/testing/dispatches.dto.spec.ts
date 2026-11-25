import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { DispatchesDto } from "#/modules/community/schema/dto/dispatches.dto.ts";
import { dispatchesExample } from "@test/modules/community/schema/dto/examples/dispatches.dto.example.ts";

/** Managed by Dryv: DispatchesDto enforces exactly what the Dispatches contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(DispatchesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = dispatchesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("DispatchesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(dispatchesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...dispatchesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
