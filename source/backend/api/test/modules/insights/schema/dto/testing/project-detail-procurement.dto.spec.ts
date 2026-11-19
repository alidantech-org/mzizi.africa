import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ProjectDetailProcurementDto } from "#/modules/insights/schema/dto/project-detail-procurement.dto.ts";
import { projectDetailProcurementExample } from "@test/modules/insights/schema/dto/examples/project-detail-procurement.dto.example.ts";

/** Managed by Dryv: ProjectDetailProcurementDto enforces exactly what the ProjectDetailProcurement contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ProjectDetailProcurementDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = projectDetailProcurementExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ProjectDetailProcurementDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(projectDetailProcurementExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...projectDetailProcurementExample.valid(),
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
