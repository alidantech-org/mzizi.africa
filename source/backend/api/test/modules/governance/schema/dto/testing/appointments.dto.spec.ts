import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { AppointmentsDto } from "#/modules/governance/schema/dto/appointments.dto.ts";
import { appointmentsExample } from "@test/modules/governance/schema/dto/examples/appointments.dto.example.ts";

/** Managed by Dryv: AppointmentsDto enforces exactly what the Appointments contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(AppointmentsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = appointmentsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("AppointmentsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(appointmentsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...appointmentsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
