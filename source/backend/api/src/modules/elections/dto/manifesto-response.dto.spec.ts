import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ManifestoResponseDto } from "#/modules/elections/dto/manifesto-response.dto.ts";
import { manifestoResponseExample } from "#/modules/elections/dto/manifesto-response.dto.example.ts";

/** Managed by Dryv: ManifestoResponseDto enforces exactly what the ManifestoResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ManifestoResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = manifestoResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ManifestoResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(manifestoResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...manifestoResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});