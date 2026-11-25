import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { HansardsDto } from "#/modules/legislature/schema/dto/hansards.dto.ts";
import { hansardsExample } from "@test/modules/legislature/schema/dto/examples/hansards.dto.example.ts";

/** Managed by Dryv: HansardsDto enforces exactly what the Hansards contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(HansardsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = hansardsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("HansardsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(hansardsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...hansardsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
