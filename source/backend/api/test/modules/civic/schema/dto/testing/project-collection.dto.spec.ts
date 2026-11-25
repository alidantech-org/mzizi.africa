import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ProjectCollectionDto } from "#/modules/civic/schema/dto/project-collection.dto.ts";
import { projectCollectionExample } from "@test/modules/civic/schema/dto/examples/project-collection.dto.example.ts";

/** Managed by Dryv: ProjectCollectionDto enforces exactly what the ProjectCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ProjectCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = projectCollectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ProjectCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(projectCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...projectCollectionExample.valid(),
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
