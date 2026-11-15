import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PublicationReceiptsDto } from "#/modules/source/dto/publication-receipts.dto.ts";
import { publicationReceiptsExample } from "#/modules/source/dto/examples/publication-receipts.dto.example.ts";

/** Managed by Dryv: PublicationReceiptsDto enforces exactly what the PublicationReceipts contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PublicationReceiptsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = publicationReceiptsExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PublicationReceiptsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(publicationReceiptsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...publicationReceiptsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});