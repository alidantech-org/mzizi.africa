import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { AttachmentsDto } from "#/modules/community/schema/dto/attachments.dto.ts";
import { attachmentsExample } from "@test/modules/community/schema/dto/examples/attachments.dto.example.ts";

/** Managed by Dryv: AttachmentsDto enforces exactly what the Attachments contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(AttachmentsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = attachmentsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("AttachmentsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(attachmentsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...attachmentsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
