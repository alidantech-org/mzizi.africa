import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CountryTimelineDto } from "#/modules/history/schema/dto/country-timeline.dto.ts";
import { countryTimelineExample } from "@test/modules/history/schema/dto/examples/country-timeline.dto.example.ts";

/** Managed by Dryv: CountryTimelineDto enforces exactly what the CountryTimeline contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CountryTimelineDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = countryTimelineExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CountryTimelineDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(countryTimelineExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...countryTimelineExample.valid(),
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
