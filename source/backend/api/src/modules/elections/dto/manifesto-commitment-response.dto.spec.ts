import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ManifestoCommitmentResponseDto } from "#/modules/elections/dto/manifesto-commitment-response.dto.ts";
import { manifestoCommitmentResponseExample } from "#/modules/elections/dto/manifesto-commitment-response.dto.example.ts";

/** Managed by Dryv: ManifestoCommitmentResponseDto enforces exactly what the ManifestoCommitmentResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ManifestoCommitmentResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = manifestoCommitmentResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ManifestoCommitmentResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(manifestoCommitmentResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...manifestoCommitmentResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});