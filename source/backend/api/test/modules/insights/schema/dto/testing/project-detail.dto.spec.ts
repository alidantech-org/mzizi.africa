import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ProjectDetailDto } from "#/modules/insights/schema/dto/project-detail.dto.ts";
import { projectDetailExample } from "@test/modules/insights/schema/dto/examples/project-detail.dto.example.ts";

/** Managed by Dryv: ProjectDetailDto enforces exactly what the ProjectDetail contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ProjectDetailDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = projectDetailExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ProjectDetailDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(projectDetailExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...projectDetailExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
