import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LawListDto } from "#/modules/insights/schema/dto/law-list.dto.ts";
import { lawListExample } from "@test/modules/insights/schema/dto/examples/law-list.dto.example.ts";

/** Managed by Dryv: LawListDto enforces exactly what the LawList contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LawListDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = lawListExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LawListDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(lawListExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...lawListExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
