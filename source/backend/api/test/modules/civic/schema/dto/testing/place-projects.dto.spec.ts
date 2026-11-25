import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceProjectsDto } from "#/modules/civic/schema/dto/place-projects.dto.ts";
import { placeProjectsExample } from "@test/modules/civic/schema/dto/examples/place-projects.dto.example.ts";

/** Managed by Dryv: PlaceProjectsDto enforces exactly what the PlaceProjects contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceProjectsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeProjectsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceProjectsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeProjectsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...placeProjectsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
