import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PartitionedEntityDto } from "#/modules/shared/schema/dto/partitioned-entity.dto.ts";
import { partitionedEntityExample } from "@test/modules/shared/schema/dto/examples/partitioned-entity.dto.example.ts";

/** Managed by Dryv: PartitionedEntityDto enforces exactly what the PartitionedEntity contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PartitionedEntityDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = partitionedEntityExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PartitionedEntityDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(partitionedEntityExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...partitionedEntityExample.valid(),
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
