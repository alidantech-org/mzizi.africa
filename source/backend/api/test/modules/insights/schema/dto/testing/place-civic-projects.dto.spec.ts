import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceCivicProjectsDto } from "#/modules/insights/schema/dto/place-civic-projects.dto.ts";
import { placeCivicProjectsExample } from "@test/modules/insights/schema/dto/examples/place-civic-projects.dto.example.ts";

/** Managed by Dryv: PlaceCivicProjectsDto enforces exactly what the PlaceCivicProjects contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceCivicProjectsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeCivicProjectsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceCivicProjectsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeCivicProjectsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...placeCivicProjectsExample.valid(),
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
