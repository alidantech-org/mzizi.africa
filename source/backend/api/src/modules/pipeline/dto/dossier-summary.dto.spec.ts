import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { DossierSummaryDto } from "#/modules/pipeline/dto/dossier-summary.dto.ts";
import { dossierSummaryExample } from "#/modules/pipeline/dto/dossier-summary.dto.example.ts";

/** Managed by Dryv: DossierSummaryDto enforces exactly what the DossierSummary contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(DossierSummaryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = dossierSummaryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("DossierSummaryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(dossierSummaryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...dossierSummaryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});