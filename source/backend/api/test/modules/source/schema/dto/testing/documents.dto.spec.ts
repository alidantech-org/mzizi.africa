import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { DocumentsDto } from "#/modules/source/schema/dto/documents.dto.ts";
import { documentsExample } from "@test/modules/source/schema/dto/examples/documents.dto.example.ts";

/** Managed by Dryv: DocumentsDto enforces exactly what the Documents contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(DocumentsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = documentsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("DocumentsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(documentsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...documentsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
