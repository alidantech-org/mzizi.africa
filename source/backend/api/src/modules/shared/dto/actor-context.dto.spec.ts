import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ActorContextDto } from "#/modules/shared/dto/actor-context.dto.ts";
import { actorContextExample } from "#/modules/shared/dto/actor-context.dto.example.ts";

/** Managed by Dryv: ActorContextDto enforces exactly what the ActorContext contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ActorContextDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = actorContextExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ActorContextDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(actorContextExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...actorContextExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});