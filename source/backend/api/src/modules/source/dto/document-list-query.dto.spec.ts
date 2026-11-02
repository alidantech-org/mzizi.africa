import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { DocumentListQueryDto } from "#/modules/source/dto/document-list-query.dto.ts";
import { documentListQueryExample } from "#/modules/source/dto/document-list-query.dto.example.ts";

/** Managed by Dryv: DocumentListQueryDto enforces exactly what the DocumentListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(DocumentListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = documentListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("DocumentListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(documentListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...documentListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});