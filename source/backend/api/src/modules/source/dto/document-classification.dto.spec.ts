import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { DocumentClassificationDto } from "#/modules/source/dto/document-classification.dto.ts";
import { documentClassificationExample } from "#/modules/source/dto/document-classification.dto.example.ts";

/** Managed by Dryv: DocumentClassificationDto enforces exactly what the DocumentClassification contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(DocumentClassificationDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = documentClassificationExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("DocumentClassificationDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(documentClassificationExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...documentClassificationExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});