import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SchedulesDto } from "#/modules/event/schema/dto/schedules.dto.ts";
import { schedulesExample } from "@test/modules/event/schema/dto/examples/schedules.dto.example.ts";

/** Managed by Dryv: SchedulesDto enforces exactly what the Schedules contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SchedulesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = schedulesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("SchedulesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(schedulesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...schedulesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
