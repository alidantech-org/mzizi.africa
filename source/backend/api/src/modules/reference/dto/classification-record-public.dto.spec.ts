import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ClassificationRecordPublicDto } from "#/modules/reference/dto/classification-record-public.dto.ts";
import { classificationRecordPublicExample } from "#/modules/reference/dto/classification-record-public.dto.example.ts";

/** Managed by Dryv: ClassificationRecordPublicDto enforces exactly what the ClassificationRecordPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ClassificationRecordPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = classificationRecordPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ClassificationRecordPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(classificationRecordPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...classificationRecordPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});