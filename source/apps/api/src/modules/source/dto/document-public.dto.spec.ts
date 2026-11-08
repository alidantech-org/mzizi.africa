import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { DocumentPublicDto } from "#/modules/source/dto/document-public.dto.ts";
import { documentPublicExample } from "#/modules/source/dto/document-public.dto.example.ts";

/** Managed by Dryv: DocumentPublicDto enforces exactly what the DocumentPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(DocumentPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = documentPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("DocumentPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(documentPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...documentPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});