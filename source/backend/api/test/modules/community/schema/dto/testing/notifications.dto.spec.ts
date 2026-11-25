import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { NotificationsDto } from "#/modules/community/schema/dto/notifications.dto.ts";
import { notificationsExample } from "@test/modules/community/schema/dto/examples/notifications.dto.example.ts";

/** Managed by Dryv: NotificationsDto enforces exactly what the Notifications contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(NotificationsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = notificationsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("NotificationsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(notificationsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...notificationsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
