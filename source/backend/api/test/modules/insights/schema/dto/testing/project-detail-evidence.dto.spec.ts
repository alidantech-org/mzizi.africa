import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ProjectDetailEvidenceDto } from "#/modules/insights/schema/dto/project-detail-evidence.dto.ts";
import { projectDetailEvidenceExample } from "@test/modules/insights/schema/dto/examples/project-detail-evidence.dto.example.ts";

/** Managed by Dryv: ProjectDetailEvidenceDto enforces exactly what the ProjectDetailEvidence contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ProjectDetailEvidenceDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = projectDetailEvidenceExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ProjectDetailEvidenceDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(projectDetailEvidenceExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...projectDetailEvidenceExample.valid(),
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
