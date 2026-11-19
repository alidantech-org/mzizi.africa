import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstitutionDetailContentSubjectDto } from "#/modules/insights/schema/dto/institution-detail-content-subject.dto.ts";
import { institutionDetailContentSubjectExample } from "@test/modules/insights/schema/dto/examples/institution-detail-content-subject.dto.example.ts";

/** Managed by Dryv: InstitutionDetailContentSubjectDto enforces exactly what the InstitutionDetailContentSubject contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstitutionDetailContentSubjectDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = institutionDetailContentSubjectExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("InstitutionDetailContentSubjectDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(institutionDetailContentSubjectExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...institutionDetailContentSubjectExample.valid(),
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
