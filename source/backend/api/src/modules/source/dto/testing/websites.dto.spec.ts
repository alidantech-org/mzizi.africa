import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { WebsitesDto } from "#/modules/source/dto/websites.dto.ts";
import { websitesExample } from "#/modules/source/dto/examples/websites.dto.example.ts";

/** Managed by Dryv: WebsitesDto enforces exactly what the Websites contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(WebsitesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = websitesExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("WebsitesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(websitesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...websitesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});