import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ClassificationRecordListQueryDto } from "#/modules/reference/dto/classification-record-list-query.dto.ts";
import { classificationRecordListQueryExample } from "#/modules/reference/dto/classification-record-list-query.dto.example.ts";

/** Managed by Dryv: ClassificationRecordListQueryDto enforces exactly what the ClassificationRecordListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ClassificationRecordListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = classificationRecordListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ClassificationRecordListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(classificationRecordListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...classificationRecordListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});