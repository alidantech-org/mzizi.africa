import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { JobSummaryDto } from "#/modules/pipeline/dto/job-summary.dto.ts";
import { jobSummaryExample } from "#/modules/pipeline/dto/job-summary.dto.example.ts";

/** Managed by Dryv: JobSummaryDto enforces exactly what the JobSummary contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(JobSummaryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = jobSummaryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("JobSummaryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(jobSummaryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...jobSummaryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});