import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PublisherResponseDto } from "#/modules/source/dto/publisher-response.dto.ts";
import { publisherResponseExample } from "#/modules/source/dto/publisher-response.dto.example.ts";

/** Managed by Dryv: PublisherResponseDto enforces exactly what the PublisherResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PublisherResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = publisherResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PublisherResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(publisherResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...publisherResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});