import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ManifestoListQueryDto } from "#/modules/elections/dto/manifesto-list-query.dto.ts";
import { manifestoListQueryExample } from "#/modules/elections/dto/manifesto-list-query.dto.example.ts";

/** Managed by Dryv: ManifestoListQueryDto enforces exactly what the ManifestoListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ManifestoListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = manifestoListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ManifestoListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(manifestoListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...manifestoListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});