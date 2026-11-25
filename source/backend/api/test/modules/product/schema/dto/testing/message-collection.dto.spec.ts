import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { MessageCollectionDto } from "#/modules/product/schema/dto/message-collection.dto.ts";
import { messageCollectionExample } from "@test/modules/product/schema/dto/examples/message-collection.dto.example.ts";

/** Managed by Dryv: MessageCollectionDto enforces exactly what the MessageCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(MessageCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = messageCollectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("MessageCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(messageCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...messageCollectionExample.valid(),
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
