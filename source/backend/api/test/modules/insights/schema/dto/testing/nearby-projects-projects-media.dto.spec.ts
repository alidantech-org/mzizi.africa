import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { NearbyProjectsProjectsMediaDto } from "#/modules/insights/schema/dto/nearby-projects-projects-media.dto.ts";
import { nearbyProjectsProjectsMediaExample } from "@test/modules/insights/schema/dto/examples/nearby-projects-projects-media.dto.example.ts";

/** Managed by Dryv: NearbyProjectsProjectsMediaDto enforces exactly what the NearbyProjectsProjectsMedia contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(NearbyProjectsProjectsMediaDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = nearbyProjectsProjectsMediaExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("NearbyProjectsProjectsMediaDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(nearbyProjectsProjectsMediaExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...nearbyProjectsProjectsMediaExample.valid(),
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
