import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CopyCatalogDto } from "#/modules/experience/schema/dto/copy-catalog.dto.ts";
import { copyCatalogExample } from "@test/modules/experience/schema/dto/examples/copy-catalog.dto.example.ts";

/** Managed by Dryv: CopyCatalogDto enforces exactly what the CopyCatalog contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CopyCatalogDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = copyCatalogExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CopyCatalogDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(copyCatalogExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...copyCatalogExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
