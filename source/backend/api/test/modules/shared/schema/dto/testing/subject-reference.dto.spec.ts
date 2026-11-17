import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SubjectReferenceDto } from "#/modules/shared/schema/dto/subject-reference.dto.ts";
import { subjectReferenceExample } from "@test/modules/shared/schema/dto/examples/subject-reference.dto.example.ts";

/** Managed by Dryv: SubjectReferenceDto enforces exactly what the SubjectReference contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SubjectReferenceDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = subjectReferenceExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("SubjectReferenceDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(subjectReferenceExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...subjectReferenceExample.valid(),
        unexpectedField: 1,
      }),
    ).toContain("unexpectedField");
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
