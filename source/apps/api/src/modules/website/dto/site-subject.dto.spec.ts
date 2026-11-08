import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SiteSubjectDto } from "#/modules/website/dto/site-subject.dto.ts";
import { siteSubjectExample } from "#/modules/website/dto/site-subject.dto.example.ts";

/** Managed by Dryv: SiteSubjectDto enforces exactly what the SiteSubject contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SiteSubjectDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = siteSubjectExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SiteSubjectDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(siteSubjectExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...siteSubjectExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});