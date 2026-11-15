import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SourcesDto } from "#/modules/source/dto/sources.dto.ts";
import { sourcesExample } from "#/modules/source/dto/examples/sources.dto.example.ts";

/** Managed by Dryv: SourcesDto enforces exactly what the Sources contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SourcesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = sourcesExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SourcesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(sourcesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...sourcesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});