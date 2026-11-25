import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { AlignmentsDto } from "#/modules/politics/schema/dto/alignments.dto.ts";
import { alignmentsExample } from "@test/modules/politics/schema/dto/examples/alignments.dto.example.ts";

/** Managed by Dryv: AlignmentsDto enforces exactly what the Alignments contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(AlignmentsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = alignmentsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("AlignmentsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(alignmentsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...alignmentsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
