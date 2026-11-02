import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ApiMessageDto } from "#/modules/shared/dto/api-message.dto.ts";
import { apiMessageExample } from "#/modules/shared/dto/api-message.dto.example.ts";

/** Managed by Dryv: ApiMessageDto enforces exactly what the ApiMessage contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ApiMessageDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = apiMessageExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ApiMessageDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(apiMessageExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({ ...apiMessageExample.valid(), unexpectedField: 1 }),
    ).toContain("unexpectedField");
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
