import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ManifestosListResponseDto } from "#/modules/elections/dto/manifestos-list-response.dto.ts";
import { manifestosListResponseExample } from "#/modules/elections/dto/manifestos-list-response.dto.example.ts";

/** Managed by Dryv: ManifestosListResponseDto enforces exactly what the ManifestosListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ManifestosListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = manifestosListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ManifestosListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(manifestosListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...manifestosListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});