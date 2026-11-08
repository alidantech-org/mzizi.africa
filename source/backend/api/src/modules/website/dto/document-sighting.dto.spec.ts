import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { DocumentSightingDto } from "#/modules/website/dto/document-sighting.dto.ts";
import { documentSightingExample } from "#/modules/website/dto/document-sighting.dto.example.ts";

/** Managed by Dryv: DocumentSightingDto enforces exactly what the DocumentSighting contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(DocumentSightingDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = documentSightingExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("DocumentSightingDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(documentSightingExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...documentSightingExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});