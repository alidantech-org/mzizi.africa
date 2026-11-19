import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { NearbyProjectsProjectsDto } from "#/modules/insights/schema/dto/nearby-projects-projects.dto.ts";
import { nearbyProjectsProjectsExample } from "@test/modules/insights/schema/dto/examples/nearby-projects-projects.dto.example.ts";

/** Managed by Dryv: NearbyProjectsProjectsDto enforces exactly what the NearbyProjectsProjects contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(NearbyProjectsProjectsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = nearbyProjectsProjectsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("NearbyProjectsProjectsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(nearbyProjectsProjectsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...nearbyProjectsProjectsExample.valid(),
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
