import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { MakerCommitmentsDto } from "#/modules/politics/schema/dto/maker-commitments.dto.ts";
import { makerCommitmentsExample } from "@test/modules/politics/schema/dto/examples/maker-commitments.dto.example.ts";

/** Managed by Dryv: MakerCommitmentsDto enforces exactly what the MakerCommitments contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(MakerCommitmentsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = makerCommitmentsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("MakerCommitmentsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(makerCommitmentsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...makerCommitmentsExample.valid(),
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
