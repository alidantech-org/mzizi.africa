import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IdentityMediaDto } from "#/modules/media/schema/dto/identity-media.dto.ts";
import { identityMediaExample } from "@test/modules/media/schema/dto/examples/identity-media.dto.example.ts";

/** Managed by Dryv: IdentityMediaDto enforces exactly what the IdentityMedia contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IdentityMediaDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = identityMediaExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("IdentityMediaDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(identityMediaExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...identityMediaExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
