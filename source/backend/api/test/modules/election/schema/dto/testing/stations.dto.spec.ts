import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { StationsDto } from "#/modules/election/schema/dto/stations.dto.ts";
import { stationsExample } from "@test/modules/election/schema/dto/examples/stations.dto.example.ts";

/** Managed by Dryv: StationsDto enforces exactly what the Stations contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(StationsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = stationsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("StationsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(stationsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...stationsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
