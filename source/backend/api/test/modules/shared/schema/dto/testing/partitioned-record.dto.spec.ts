import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PartitionedRecordDto } from "#/modules/shared/schema/dto/partitioned-record.dto.ts";
import { partitionedRecordExample } from "@test/modules/shared/schema/dto/examples/partitioned-record.dto.example.ts";

/** Managed by Dryv: PartitionedRecordDto enforces exactly what the PartitionedRecord contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PartitionedRecordDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = partitionedRecordExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PartitionedRecordDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(partitionedRecordExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...partitionedRecordExample.valid(),
        unexpectedField: 1,
      }),
    ).toContain("unexpectedField");
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
