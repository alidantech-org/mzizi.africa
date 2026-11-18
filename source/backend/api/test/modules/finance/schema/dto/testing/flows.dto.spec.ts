import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FlowsDto } from "#/modules/finance/schema/dto/flows.dto.ts";
import { flowsExample } from "@test/modules/finance/schema/dto/examples/flows.dto.example.ts";

/** Managed by Dryv: FlowsDto enforces exactly what the Flows contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FlowsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = flowsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("FlowsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(flowsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...flowsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
