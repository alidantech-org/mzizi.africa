import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SubjectsDto } from "#/modules/media/schema/dto/subjects.dto.ts";
import { subjectsExample } from "@test/modules/media/schema/dto/examples/subjects.dto.example.ts";

/** Managed by Dryv: SubjectsDto enforces exactly what the Subjects contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SubjectsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = subjectsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("SubjectsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(subjectsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...subjectsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
