import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ArtifactsDto } from "#/modules/source/schema/dto/artifacts.dto.ts";
import { artifactsExample } from "@test/modules/source/schema/dto/examples/artifacts.dto.example.ts";

/** Managed by Dryv: ArtifactsDto enforces exactly what the Artifacts contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ArtifactsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = artifactsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ArtifactsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(artifactsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...artifactsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
