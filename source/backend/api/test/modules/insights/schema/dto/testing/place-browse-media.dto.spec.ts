import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceBrowseMediaDto } from "#/modules/insights/schema/dto/place-browse-media.dto.ts";
import { placeBrowseMediaExample } from "@test/modules/insights/schema/dto/examples/place-browse-media.dto.example.ts";

/** Managed by Dryv: PlaceBrowseMediaDto enforces exactly what the PlaceBrowseMedia contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceBrowseMediaDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeBrowseMediaExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceBrowseMediaDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeBrowseMediaExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...placeBrowseMediaExample.valid(),
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
