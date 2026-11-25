import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ProjectDetailSitesDto } from "#/modules/civic/schema/dto/project-detail-sites.dto.ts";
import { projectDetailSitesExample } from "@test/modules/civic/schema/dto/examples/project-detail-sites.dto.example.ts";

/** Managed by Dryv: ProjectDetailSitesDto enforces exactly what the ProjectDetailSites contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ProjectDetailSitesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = projectDetailSitesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ProjectDetailSitesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(projectDetailSitesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...projectDetailSitesExample.valid(),
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
