import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ClassCountDto } from "#/modules/experience/schema/dto/class-count.dto.ts";
import { classCountExample } from "@test/modules/experience/schema/dto/examples/class-count.dto.example.ts";

/** Managed by Dryv: ClassCountDto enforces exactly what the ClassCount contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ClassCountDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = classCountExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ClassCountDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(classCountExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...classCountExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
