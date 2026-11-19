import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceCivicInfrastructureDto } from "#/modules/insights/schema/dto/place-civic-infrastructure.dto.ts";
import { placeCivicInfrastructureExample } from "@test/modules/insights/schema/dto/examples/place-civic-infrastructure.dto.example.ts";

/** Managed by Dryv: PlaceCivicInfrastructureDto enforces exactly what the PlaceCivicInfrastructure contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceCivicInfrastructureDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeCivicInfrastructureExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceCivicInfrastructureDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeCivicInfrastructureExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...placeCivicInfrastructureExample.valid(),
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
