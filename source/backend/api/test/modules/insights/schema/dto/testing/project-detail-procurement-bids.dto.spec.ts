import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ProjectDetailProcurementBidsDto } from "#/modules/insights/schema/dto/project-detail-procurement-bids.dto.ts";
import { projectDetailProcurementBidsExample } from "@test/modules/insights/schema/dto/examples/project-detail-procurement-bids.dto.example.ts";

/** Managed by Dryv: ProjectDetailProcurementBidsDto enforces exactly what the ProjectDetailProcurementBids contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ProjectDetailProcurementBidsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = projectDetailProcurementBidsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ProjectDetailProcurementBidsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(projectDetailProcurementBidsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...projectDetailProcurementBidsExample.valid(),
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
