import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { DocumentResponseDto } from "#/modules/source/dto/document-response.dto.ts";
import { documentResponseExample } from "#/modules/source/dto/document-response.dto.example.ts";

/** Managed by Dryv: DocumentResponseDto enforces exactly what the DocumentResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(DocumentResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = documentResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("DocumentResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(documentResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...documentResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});