import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstrumentDetailEditionsDto } from "#/modules/legal/schema/dto/instrument-detail-editions.dto.ts";
import { instrumentDetailEditionsExample } from "@test/modules/legal/schema/dto/examples/instrument-detail-editions.dto.example.ts";

/** Managed by Dryv: InstrumentDetailEditionsDto enforces exactly what the InstrumentDetailEditions contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstrumentDetailEditionsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = instrumentDetailEditionsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("InstrumentDetailEditionsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(instrumentDetailEditionsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...instrumentDetailEditionsExample.valid(),
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
