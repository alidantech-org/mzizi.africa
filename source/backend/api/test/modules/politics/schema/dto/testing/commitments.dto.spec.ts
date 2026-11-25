import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CommitmentsDto } from "#/modules/politics/schema/dto/commitments.dto.ts";
import { commitmentsExample } from "@test/modules/politics/schema/dto/examples/commitments.dto.example.ts";

/** Managed by Dryv: CommitmentsDto enforces exactly what the Commitments contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CommitmentsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = commitmentsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CommitmentsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(commitmentsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...commitmentsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
