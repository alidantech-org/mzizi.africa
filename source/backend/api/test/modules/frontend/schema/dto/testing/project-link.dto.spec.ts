import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ProjectLinkDto } from "#/modules/frontend/schema/dto/project-link.dto.ts";
import { projectLinkExample } from "@test/modules/frontend/schema/dto/examples/project-link.dto.example.ts";

/** Managed by Dryv: ProjectLinkDto enforces exactly what the ProjectLink contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ProjectLinkDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = projectLinkExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ProjectLinkDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(projectLinkExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...projectLinkExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
