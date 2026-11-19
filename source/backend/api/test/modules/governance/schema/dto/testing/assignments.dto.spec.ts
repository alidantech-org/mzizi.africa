import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { AssignmentsDto } from "#/modules/governance/schema/dto/assignments.dto.ts";
import { assignmentsExample } from "@test/modules/governance/schema/dto/examples/assignments.dto.example.ts";

/** Managed by Dryv: AssignmentsDto enforces exactly what the Assignments contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(AssignmentsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = assignmentsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("AssignmentsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(assignmentsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...assignmentsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
