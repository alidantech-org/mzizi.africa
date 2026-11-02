import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { StoredObjectDto } from "#/modules/filesystem/dto/stored-object.dto.ts";
import { storedObjectExample } from "#/modules/filesystem/dto/stored-object.dto.example.ts";

/** Managed by Dryv: StoredObjectDto enforces exactly what the StoredObject contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(StoredObjectDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = storedObjectExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("StoredObjectDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(storedObjectExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...storedObjectExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});