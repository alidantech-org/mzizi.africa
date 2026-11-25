import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ProjectDetailContractsDto } from "#/modules/civic/schema/dto/project-detail-contracts.dto.ts";
import { projectDetailContractsExample } from "@test/modules/civic/schema/dto/examples/project-detail-contracts.dto.example.ts";

/** Managed by Dryv: ProjectDetailContractsDto enforces exactly what the ProjectDetailContracts contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ProjectDetailContractsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = projectDetailContractsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ProjectDetailContractsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(projectDetailContractsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...projectDetailContractsExample.valid(),
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
