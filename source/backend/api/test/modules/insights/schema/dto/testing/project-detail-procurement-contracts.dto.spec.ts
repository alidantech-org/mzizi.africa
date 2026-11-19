import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ProjectDetailProcurementContractsDto } from "#/modules/insights/schema/dto/project-detail-procurement-contracts.dto.ts";
import { projectDetailProcurementContractsExample } from "@test/modules/insights/schema/dto/examples/project-detail-procurement-contracts.dto.example.ts";

/** Managed by Dryv: ProjectDetailProcurementContractsDto enforces exactly what the ProjectDetailProcurementContracts contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ProjectDetailProcurementContractsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = projectDetailProcurementContractsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ProjectDetailProcurementContractsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(projectDetailProcurementContractsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...projectDetailProcurementContractsExample.valid(),
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
