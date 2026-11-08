import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ManifestoCommitmentPublicDto } from "#/modules/elections/dto/manifesto-commitment-public.dto.ts";
import { manifestoCommitmentPublicExample } from "#/modules/elections/dto/manifesto-commitment-public.dto.example.ts";

/** Managed by Dryv: ManifestoCommitmentPublicDto enforces exactly what the ManifestoCommitmentPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ManifestoCommitmentPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = manifestoCommitmentPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ManifestoCommitmentPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(manifestoCommitmentPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...manifestoCommitmentPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});