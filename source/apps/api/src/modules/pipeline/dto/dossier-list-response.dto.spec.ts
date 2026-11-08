import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { DossierListResponseDto } from "#/modules/pipeline/dto/dossier-list-response.dto.ts";
import { dossierListResponseExample } from "#/modules/pipeline/dto/dossier-list-response.dto.example.ts";

/** Managed by Dryv: DossierListResponseDto enforces exactly what the DossierListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(DossierListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = dossierListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("DossierListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(dossierListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...dossierListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});