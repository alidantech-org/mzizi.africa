import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LegalBasisSubjectDto } from "#/modules/insights/schema/dto/legal-basis-subject.dto.ts";
import { legalBasisSubjectExample } from "@test/modules/insights/schema/dto/examples/legal-basis-subject.dto.example.ts";

/** Managed by Dryv: LegalBasisSubjectDto enforces exactly what the LegalBasisSubject contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LegalBasisSubjectDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = legalBasisSubjectExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LegalBasisSubjectDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(legalBasisSubjectExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...legalBasisSubjectExample.valid(),
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
