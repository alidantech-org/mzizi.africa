import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PersonContactListQueryDto } from "#/modules/person/dto/person-contact-list-query.dto.ts";
import { personContactListQueryExample } from "#/modules/person/dto/person-contact-list-query.dto.example.ts";

/** Managed by Dryv: PersonContactListQueryDto enforces exactly what the PersonContactListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PersonContactListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = personContactListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PersonContactListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(personContactListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...personContactListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});