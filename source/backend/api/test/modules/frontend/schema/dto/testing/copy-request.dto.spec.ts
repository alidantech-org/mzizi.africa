import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CopyRequestDto } from "#/modules/frontend/schema/dto/copy-request.dto.ts";
import { copyRequestExample } from "@test/modules/frontend/schema/dto/examples/copy-request.dto.example.ts";

/** Managed by Dryv: CopyRequestDto enforces exactly what the CopyRequest contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CopyRequestDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = copyRequestExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CopyRequestDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(copyRequestExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...copyRequestExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
