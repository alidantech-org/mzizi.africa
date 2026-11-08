import { BadRequestException, type PipeTransform } from "@nestjs/common";

/** A zod schema: anything with `safeParse`. */
interface SafeParseSchema {
  safeParse(value: unknown):
    | { success: true; data: unknown }
    | { success: false; error: { issues: readonly { path: readonly PropertyKey[]; message: string }[] } };
}

/** A Joi schema: anything with `validate`. */
interface ValidateSchema {
  validate(
    value: unknown,
    options: { abortEarly: boolean },
  ): { value: unknown; error?: { details: readonly { path: readonly PropertyKey[]; message: string }[] } };
}

/**
 * Validates a body or parameter with a zod or Joi schema from the bound validation pack.
 * It duck-types the schema, so it needs neither library installed to compile.
 */
export class SchemaValidationPipe implements PipeTransform {
  constructor(private readonly schema: SafeParseSchema | ValidateSchema) {}

  transform(value: unknown): unknown {
    if ("safeParse" in this.schema) {
      const result = this.schema.safeParse(value);
      if (result.success) return result.data;
      throw new BadRequestException(
        result.error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })),
      );
    }
    const result = this.schema.validate(value, { abortEarly: false });
    if (result.error === undefined) return result.value;
    throw new BadRequestException(
      result.error.details.map((detail) => ({ path: detail.path.join("."), message: detail.message })),
    );
  }
}
