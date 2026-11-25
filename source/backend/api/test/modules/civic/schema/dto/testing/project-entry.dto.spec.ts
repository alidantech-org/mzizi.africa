import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ProjectEntryDto } from "#/modules/civic/schema/dto/project-entry.dto.ts";
import { projectEntryExample } from "@test/modules/civic/schema/dto/examples/project-entry.dto.example.ts";

/** Managed by Dryv: ProjectEntryDto enforces exactly what the ProjectEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ProjectEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = projectEntryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ProjectEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(projectEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...projectEntryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
