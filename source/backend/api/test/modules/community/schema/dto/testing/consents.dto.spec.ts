import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ConsentsDto } from "#/modules/community/schema/dto/consents.dto.ts";
import { consentsExample } from "@test/modules/community/schema/dto/examples/consents.dto.example.ts";

/** Managed by Dryv: ConsentsDto enforces exactly what the Consents contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ConsentsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = consentsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ConsentsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(consentsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...consentsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
