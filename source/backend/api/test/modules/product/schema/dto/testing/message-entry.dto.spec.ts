import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { MessageEntryDto } from "#/modules/product/schema/dto/message-entry.dto.ts";
import { messageEntryExample } from "@test/modules/product/schema/dto/examples/message-entry.dto.example.ts";

/** Managed by Dryv: MessageEntryDto enforces exactly what the MessageEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(MessageEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = messageEntryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("MessageEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(messageEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...messageEntryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
