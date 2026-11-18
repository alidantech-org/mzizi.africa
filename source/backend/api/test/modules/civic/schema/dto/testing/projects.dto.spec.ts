import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ProjectsDto } from "#/modules/civic/schema/dto/projects.dto.ts";
import { projectsExample } from "@test/modules/civic/schema/dto/examples/projects.dto.example.ts";

/** Managed by Dryv: ProjectsDto enforces exactly what the Projects contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ProjectsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = projectsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ProjectsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(projectsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...projectsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
