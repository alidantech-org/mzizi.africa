import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ClassificationRecordResponseDto } from "#/modules/reference/dto/classification-record-response.dto.ts";
import { classificationRecordResponseExample } from "#/modules/reference/dto/classification-record-response.dto.example.ts";

/** Managed by Dryv: ClassificationRecordResponseDto enforces exactly what the ClassificationRecordResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ClassificationRecordResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = classificationRecordResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ClassificationRecordResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(classificationRecordResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...classificationRecordResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});