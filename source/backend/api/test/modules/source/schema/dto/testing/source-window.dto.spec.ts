import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SourceWindowDto } from "#/modules/source/schema/dto/source-window.dto.ts";
import { sourceWindowExample } from "@test/modules/source/schema/dto/examples/source-window.dto.example.ts";

/** Managed by Dryv: SourceWindowDto enforces exactly what the SourceWindow contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SourceWindowDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = sourceWindowExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("SourceWindowDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(sourceWindowExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...sourceWindowExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
