import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceElectionsElectionsContestsCandidatesDto } from "#/modules/insights/schema/dto/place-elections-elections-contests-candidates.dto.ts";
import { placeElectionsElectionsContestsCandidatesExample } from "@test/modules/insights/schema/dto/examples/place-elections-elections-contests-candidates.dto.example.ts";

/** Managed by Dryv: PlaceElectionsElectionsContestsCandidatesDto enforces exactly what the PlaceElectionsElectionsContestsCandidates contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(
    plainToInstance(PlaceElectionsElectionsContestsCandidatesDto, value),
    {
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: false,
    },
  );
  return errors.map((error) => error.property);
}

const cases = placeElectionsElectionsContestsCandidatesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceElectionsElectionsContestsCandidatesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeElectionsElectionsContestsCandidatesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...placeElectionsElectionsContestsCandidatesExample.valid(),
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
