import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { MessageWindowDto } from "#/modules/product/schema/dto/message-window.dto.ts";
import { messageWindowExample } from "@test/modules/product/schema/dto/examples/message-window.dto.example.ts";

/** Managed by Dryv: MessageWindowDto enforces exactly what the MessageWindow contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(MessageWindowDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = messageWindowExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("MessageWindowDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(messageWindowExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...messageWindowExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
