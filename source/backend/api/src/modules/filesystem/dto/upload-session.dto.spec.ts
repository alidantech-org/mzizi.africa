import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { UploadSessionDto } from "#/modules/filesystem/dto/upload-session.dto.ts";
import { uploadSessionExample } from "#/modules/filesystem/dto/upload-session.dto.example.ts";

/** Managed by Dryv: UploadSessionDto enforces exactly what the UploadSession contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(UploadSessionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = uploadSessionExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("UploadSessionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(uploadSessionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...uploadSessionExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});