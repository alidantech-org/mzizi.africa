import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ProjectFeaturesDto } from "#/modules/civic/schema/dto/project-features.dto.ts";
import { projectFeaturesExample } from "@test/modules/civic/schema/dto/examples/project-features.dto.example.ts";

/** Managed by Dryv: ProjectFeaturesDto enforces exactly what the ProjectFeatures contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ProjectFeaturesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = projectFeaturesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ProjectFeaturesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(projectFeaturesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...projectFeaturesExample.valid(),
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
