import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { DocumentSummaryDto } from "#/modules/pipeline/dto/document-summary.dto.ts";
import { documentSummaryExample } from "#/modules/pipeline/dto/document-summary.dto.example.ts";

/** Managed by Dryv: DocumentSummaryDto enforces exactly what the DocumentSummary contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(DocumentSummaryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = documentSummaryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("DocumentSummaryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(documentSummaryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...documentSummaryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});