import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ResolutionDto } from "#/modules/explorer/schema/dto/resolution.dto.ts";
import { resolutionExample } from "@test/modules/explorer/schema/dto/examples/resolution.dto.example.ts";

/** Managed by Dryv: ResolutionDto enforces exactly what the Resolution contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ResolutionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = resolutionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ResolutionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(resolutionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...resolutionExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
