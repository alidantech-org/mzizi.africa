import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ManifestoCommitmentsListResponseDto } from "#/modules/elections/dto/manifesto-commitments-list-response.dto.ts";
import { manifestoCommitmentsListResponseExample } from "#/modules/elections/dto/manifesto-commitments-list-response.dto.example.ts";

/** Managed by Dryv: ManifestoCommitmentsListResponseDto enforces exactly what the ManifestoCommitmentsListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ManifestoCommitmentsListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = manifestoCommitmentsListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ManifestoCommitmentsListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(manifestoCommitmentsListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...manifestoCommitmentsListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});