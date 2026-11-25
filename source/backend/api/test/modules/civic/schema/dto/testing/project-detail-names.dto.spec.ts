import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ProjectDetailNamesDto } from "#/modules/civic/schema/dto/project-detail-names.dto.ts";
import { projectDetailNamesExample } from "@test/modules/civic/schema/dto/examples/project-detail-names.dto.example.ts";

/** Managed by Dryv: ProjectDetailNamesDto enforces exactly what the ProjectDetailNames contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ProjectDetailNamesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = projectDetailNamesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ProjectDetailNamesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(projectDetailNamesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...projectDetailNamesExample.valid(),
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
