import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstrumentWindowDto } from "#/modules/legal/schema/dto/instrument-window.dto.ts";
import { instrumentWindowExample } from "@test/modules/legal/schema/dto/examples/instrument-window.dto.example.ts";

/** Managed by Dryv: InstrumentWindowDto enforces exactly what the InstrumentWindow contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstrumentWindowDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = instrumentWindowExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("InstrumentWindowDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(instrumentWindowExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...instrumentWindowExample.valid(),
        unexpectedField: 1,
      }),
    ).toContain("unexpectedField");
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
