import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SectionVisitDto } from "#/modules/website/dto/section-visit.dto.ts";
import { sectionVisitExample } from "#/modules/website/dto/section-visit.dto.example.ts";

/** Managed by Dryv: SectionVisitDto enforces exactly what the SectionVisit contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SectionVisitDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = sectionVisitExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SectionVisitDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(sectionVisitExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...sectionVisitExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});