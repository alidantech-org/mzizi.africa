import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { DatasetLineageDto } from "#/modules/source/schema/dto/dataset-lineage.dto.ts";
import { datasetLineageExample } from "@test/modules/source/schema/dto/examples/dataset-lineage.dto.example.ts";

/** Managed by Dryv: DatasetLineageDto enforces exactly what the DatasetLineage contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(DatasetLineageDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = datasetLineageExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("DatasetLineageDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(datasetLineageExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...datasetLineageExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
