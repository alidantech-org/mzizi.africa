import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceCivicProjectsMediaDto } from "#/modules/insights/schema/dto/place-civic-projects-media.dto.ts";
import { placeCivicProjectsMediaExample } from "@test/modules/insights/schema/dto/examples/place-civic-projects-media.dto.example.ts";

/** Managed by Dryv: PlaceCivicProjectsMediaDto enforces exactly what the PlaceCivicProjectsMedia contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceCivicProjectsMediaDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeCivicProjectsMediaExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceCivicProjectsMediaDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeCivicProjectsMediaExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...placeCivicProjectsMediaExample.valid(),
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
