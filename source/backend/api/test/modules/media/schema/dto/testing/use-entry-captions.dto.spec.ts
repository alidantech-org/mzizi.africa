import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { UseEntryCaptionsDto } from "#/modules/media/schema/dto/use-entry-captions.dto.ts";
import { useEntryCaptionsExample } from "@test/modules/media/schema/dto/examples/use-entry-captions.dto.example.ts";

/** Managed by Dryv: UseEntryCaptionsDto enforces exactly what the UseEntryCaptions contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(UseEntryCaptionsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = useEntryCaptionsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("UseEntryCaptionsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(useEntryCaptionsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...useEntryCaptionsExample.valid(),
        unexpectedField: 1,
      }),
    ).toContain("unexpectedField");
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
