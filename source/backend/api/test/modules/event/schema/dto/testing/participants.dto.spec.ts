import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ParticipantsDto } from "#/modules/event/schema/dto/participants.dto.ts";
import { participantsExample } from "@test/modules/event/schema/dto/examples/participants.dto.example.ts";

/** Managed by Dryv: ParticipantsDto enforces exactly what the Participants contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ParticipantsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = participantsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ParticipantsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(participantsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...participantsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
