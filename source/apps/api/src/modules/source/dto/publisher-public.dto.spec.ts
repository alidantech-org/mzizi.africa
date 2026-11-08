import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PublisherPublicDto } from "#/modules/source/dto/publisher-public.dto.ts";
import { publisherPublicExample } from "#/modules/source/dto/publisher-public.dto.example.ts";

/** Managed by Dryv: PublisherPublicDto enforces exactly what the PublisherPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PublisherPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = publisherPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PublisherPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(publisherPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...publisherPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});