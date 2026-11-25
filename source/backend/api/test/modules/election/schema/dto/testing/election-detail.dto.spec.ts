import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ElectionDetailDto } from "#/modules/election/schema/dto/election-detail.dto.ts";
import { electionDetailExample } from "@test/modules/election/schema/dto/examples/election-detail.dto.example.ts";

/** Managed by Dryv: ElectionDetailDto enforces exactly what the ElectionDetail contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ElectionDetailDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = electionDetailExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ElectionDetailDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(electionDetailExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...electionDetailExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
