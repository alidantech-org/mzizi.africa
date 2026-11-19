import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ManifestoListDto } from "#/modules/ledger/schema/dto/manifesto-list.dto.ts";
import { manifestoListExample } from "@test/modules/ledger/schema/dto/examples/manifesto-list.dto.example.ts";

/** Managed by Dryv: ManifestoListDto enforces exactly what the ManifestoList contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ManifestoListDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = manifestoListExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ManifestoListDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(manifestoListExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...manifestoListExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
