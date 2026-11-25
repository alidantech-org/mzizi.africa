import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ProjectKeyDto } from "#/modules/civic/schema/dto/project-key.dto.ts";
import { projectKeyExample } from "@test/modules/civic/schema/dto/examples/project-key.dto.example.ts";

/** Managed by Dryv: ProjectKeyDto enforces exactly what the ProjectKey contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ProjectKeyDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = projectKeyExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ProjectKeyDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(projectKeyExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...projectKeyExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
