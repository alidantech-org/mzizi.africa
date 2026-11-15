import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { MemberCollectionDto } from "#/modules/reference/dto/member-collection.dto.ts";
import { memberCollectionExample } from "#/modules/reference/dto/examples/member-collection.dto.example.ts";

/** Managed by Dryv: MemberCollectionDto enforces exactly what the MemberCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(MemberCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = memberCollectionExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("MemberCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(memberCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...memberCollectionExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});