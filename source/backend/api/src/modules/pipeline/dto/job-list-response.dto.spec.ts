import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { JobListResponseDto } from "#/modules/pipeline/dto/job-list-response.dto.ts";
import { jobListResponseExample } from "#/modules/pipeline/dto/job-list-response.dto.example.ts";

/** Managed by Dryv: JobListResponseDto enforces exactly what the JobListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(JobListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = jobListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("JobListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(jobListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...jobListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});