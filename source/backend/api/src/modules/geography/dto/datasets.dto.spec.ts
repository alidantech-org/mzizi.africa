import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { DatasetsDto } from "#/modules/geography/dto/datasets.dto.ts";
import { datasetsExample } from "#/modules/geography/dto/datasets.dto.example.ts";

/** Managed by Dryv: DatasetsDto enforces exactly what the Datasets contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(DatasetsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = datasetsExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("DatasetsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(datasetsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...datasetsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});