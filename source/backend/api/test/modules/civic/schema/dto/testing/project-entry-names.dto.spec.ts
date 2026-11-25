import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ProjectEntryNamesDto } from "#/modules/civic/schema/dto/project-entry-names.dto.ts";
import { projectEntryNamesExample } from "@test/modules/civic/schema/dto/examples/project-entry-names.dto.example.ts";

/** Managed by Dryv: ProjectEntryNamesDto enforces exactly what the ProjectEntryNames contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ProjectEntryNamesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = projectEntryNamesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ProjectEntryNamesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(projectEntryNamesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...projectEntryNamesExample.valid(),
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
