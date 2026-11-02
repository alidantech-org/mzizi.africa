import { type ArgumentMetadata, ValidationPipe, type ValidationPipeOptions } from "@nestjs/common";
import { getMetadataStorage } from "class-validator";

/**
 * Managed by Dryv: the request validation every generated route runs with. AppModule registers
 * HttpValidationPipe globally, and the generated e2e specs use the same pipe and options, so
 * tests exercise the exact production behaviour.
 */
export const httpOptions: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  // Unknown properties are already stripped; this only stops field-less DTOs (an empty query)
  // being rejected as "unknown values" by class-validator 0.14.
  forbidUnknownValues: false,
};

/**
 * Validates like ValidationPipe, but first converts query-object values, which always arrive as
 * text, to each DTO field's declared type: numeric strings for number fields and "true"/"false"
 * for boolean fields. Bodies are not converted, so JSON stays strict.
 */
export class HttpValidationPipe extends ValidationPipe {
  override async transform(value: unknown, metadata: ArgumentMetadata): Promise<unknown> {
    if (metadata.type === "query" && metadata.metatype && isRecord(value)) {
      return super.transform(coerceQuery(value, metadata.metatype), metadata);
    }
    return super.transform(value, metadata);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const NUMERIC = new Set(["isInt", "isNumber", "isDivisibleBy", "min", "max"]);
const BOOLEAN = new Set(["isBoolean"]);

/**
 * The scalar kind of each validated field, read from the DTO's class-validator metadata rather
 * than reflected design types, which per-file compilers (SWC, esbuild) cannot resolve for
 * imported type aliases.
 */
function fieldKinds(type: abstract new (...args: never[]) => unknown): Map<string, "number" | "boolean"> {
  const kinds = new Map<string, "number" | "boolean">();
  for (const item of getMetadataStorage().getTargetValidationMetadatas(type as never, "", true, false)) {
    const name = item.name ?? "";
    if (NUMERIC.has(name)) kinds.set(item.propertyName, "number");
    else if (BOOLEAN.has(name)) kinds.set(item.propertyName, "boolean");
  }
  return kinds;
}

function coerceQuery(query: Record<string, unknown>, type: abstract new (...args: never[]) => unknown) {
  const kinds = fieldKinds(type);
  const coerced: Record<string, unknown> = { ...query };
  for (const [key, raw] of Object.entries(query)) {
    const kind = kinds.get(key);
    coerced[key] = Array.isArray(raw) ? raw.map((item) => coerce(item, kind)) : coerce(raw, kind);
  }
  return coerced;
}

function coerce(value: unknown, kind: "number" | "boolean" | undefined): unknown {
  if (typeof value !== "string") return value;
  if (kind === "number" && value.trim() !== "" && !Number.isNaN(Number(value))) return Number(value);
  if (kind === "boolean" && (value === "true" || value === "false")) return value === "true";
  return value;
}