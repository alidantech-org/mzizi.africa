import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ProjectDetailMediaDto } from "#/modules/insights/schema/dto/project-detail-media.dto.ts";
import { projectDetailMediaExample } from "@test/modules/insights/schema/dto/examples/project-detail-media.dto.example.ts";

/** Managed by Dryv: ProjectDetailMediaDto enforces exactly what the ProjectDetailMedia contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ProjectDetailMediaDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = projectDetailMediaExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ProjectDetailMediaDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(projectDetailMediaExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...projectDetailMediaExample.valid(),
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
