import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { HostedStationDto } from "#/modules/experience/schema/dto/hosted-station.dto.ts";
import { hostedStationExample } from "@test/modules/experience/schema/dto/examples/hosted-station.dto.example.ts";

/** Managed by Dryv: HostedStationDto enforces exactly what the HostedStation contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(HostedStationDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = hostedStationExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("HostedStationDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(hostedStationExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...hostedStationExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
