import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { DnsSnapshotDto } from "#/modules/website/dto/dns-snapshot.dto.ts";
import { dnsSnapshotExample } from "#/modules/website/dto/dns-snapshot.dto.example.ts";

/** Managed by Dryv: DnsSnapshotDto enforces exactly what the DnsSnapshot contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(DnsSnapshotDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = dnsSnapshotExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("DnsSnapshotDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(dnsSnapshotExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...dnsSnapshotExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});