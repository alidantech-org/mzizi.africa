import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SitesListResponseDto } from "#/modules/website/dto/sites-list-response.dto.ts";
import { sitesListResponseExample } from "#/modules/website/dto/sites-list-response.dto.example.ts";

/** Managed by Dryv: SitesListResponseDto enforces exactly what the SitesListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SitesListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = sitesListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SitesListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(sitesListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...sitesListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});