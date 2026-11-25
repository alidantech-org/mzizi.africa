import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { BlocksDto } from "#/modules/community/schema/dto/blocks.dto.ts";
import { blocksExample } from "@test/modules/community/schema/dto/examples/blocks.dto.example.ts";

/** Managed by Dryv: BlocksDto enforces exactly what the Blocks contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(BlocksDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = blocksExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("BlocksDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(blocksExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...blocksExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
