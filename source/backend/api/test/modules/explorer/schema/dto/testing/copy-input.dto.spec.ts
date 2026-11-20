import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CopyInputDto } from "#/modules/explorer/schema/dto/copy-input.dto.ts";
import { copyInputExample } from "@test/modules/explorer/schema/dto/examples/copy-input.dto.example.ts";

/** Managed by Dryv: CopyInputDto enforces exactly what the CopyInput contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CopyInputDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = copyInputExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CopyInputDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(copyInputExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...copyInputExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
