import RandExp from "randexp";

/**
 * Contract-derived examples for generated DTO tests. Each DTO's `.example.ts` file describes its
 * fields with these specs; the helpers build a valid example and one targeted violation per
 * constraint, so tests prove the validators enforce exactly what the contract says.
 */

export type FieldSpec =
  | {
      kind: "string";
      format?: string;
      minLength?: number;
      maxLength?: number;
      exactLength?: number;
      patterns?: readonly string[];
    }
  | { kind: "number"; integer?: boolean; min?: number; max?: number; multipleOf?: number }
  | { kind: "boolean" }
  | { kind: "enum"; values: readonly unknown[] }
  | { kind: "temporal"; temporal: string }
  | { kind: "record" }
  | { kind: "schema"; example: () => SchemaExample }
  | { kind: "unknown" };

export interface FieldEntry {
  name: string;
  optional: boolean;
  nullable: boolean;
  array?: { min?: number; max?: number };
  spec: FieldSpec;
}

export type Operand =
  | { field: string }
  | { literal: unknown }
  | { terms: readonly Operand[]; operator: "add" | "subtract" | "multiply" | "divide" };

export interface Comparison {
  left: Operand;
  operator:
    | "equal"
    | "not-equal"
    | "less-than"
    | "less-than-or-equal"
    | "greater-than"
    | "greater-than-or-equal";
  right: Operand;
}

export interface Invariant {
  any: boolean;
  comparisons: readonly Comparison[];
}

export interface SchemaExample {
  name: string;
  fields: readonly FieldEntry[];
  invariants: readonly Invariant[];
}

export interface Violation {
  field: string;
  reason: string;
  value: Record<string, unknown>;
}

const FORMAT_VALUES: Record<string, string> = {
  uuid: "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11",
  ulid: "01ARZ3NDEKTSV4RRFFQ69G5FAV",
  email: "ada@example.com",
  url: "https://example.com/path",
  uri: "https://example.com/path",
  hostname: "api.example.com",
  ipv4: "192.168.0.1",
  ipv6: "2001:db8::1",
  phone: "+1 555 0100",
  e164: "+15550100",
  slug: "example-slug",
  "hex-color": "#1a2b3c",
  base64: "ZHJ5dg==",
  hex: "deadbeef",
  jwt: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.c2lnbmF0dXJl",
  semver: "1.2.3",
  "mime-type": "application/json",
  locale: "en-US",
  "language-tag": "en-US",
  "country-code": "KE",
  "currency-code": "KES",
  json: '{"ok":true}',
};

/** A second valid value per format, for "must differ" invariants. */
const FORMAT_ALTERNATES: Record<string, string> = {
  uuid: "0f7a0e6e-54b8-4d1e-8a52-6f3fdbd6e7d2",
  ulid: "01BX5ZZKBKACTAV9WEVGEMMVRZ",
  email: "grace@example.com",
  url: "https://example.org/other",
  uri: "https://example.org/other",
  hostname: "www.example.org",
  ipv4: "10.0.0.1",
  ipv6: "2001:db8::2",
  phone: "+1 555 0199",
  e164: "+15550199",
  slug: "other-slug",
  "hex-color": "#3c2b1a",
  hex: "cafebabe",
  semver: "2.0.0",
  locale: "fr-FR",
  "language-tag": "fr-FR",
  "country-code": "UG",
  "currency-code": "UGX",
};

const TEMPORAL_VALUES: Record<string, string> = {
  date: "2026-01-15",
  time: "10:30:00",
  "date-time": "2026-01-15T10:30:00Z",
  instant: "2026-01-15T10:30:00Z",
  "zoned-date-time": "2026-01-15T10:30:00+03:00",
  "year-month": "2026-01",
  "month-day": "--01-15",
  duration: "P1D",
  interval: "2026-01-15T10:30:00Z/2026-01-16T10:30:00Z",
};

const MAX_DEPTH = 3;

function stringBounds(spec: Extract<FieldSpec, { kind: "string" }>): [number, number] {
  if (spec.exactLength !== undefined) return [spec.exactLength, spec.exactLength];
  return [spec.minLength ?? 1, spec.maxLength ?? Math.max(spec.minLength ?? 1, 12)];
}

function fitsLength(value: string, spec: Extract<FieldSpec, { kind: "string" }>): boolean {
  const [min, max] = stringBounds(spec);
  return value.length >= min && value.length <= max;
}

function matchesPatterns(value: string, patterns: readonly string[] | undefined): boolean {
  return (patterns ?? []).every((pattern) => new RegExp(pattern).test(value));
}

function exampleString(spec: Extract<FieldSpec, { kind: "string" }>): string {
  const [min, max] = stringBounds(spec);
  if (spec.patterns && spec.patterns.length > 0) {
    const first = spec.patterns[0] as string;
    for (let attempt = 0; attempt < 200; attempt += 1) {
      const generator = new RandExp(first);
      generator.max = Math.max(1, Math.min(max, 16));
      const candidate = generator.gen();
      if (fitsLength(candidate, spec) && matchesPatterns(candidate, spec.patterns)) return candidate;
    }
    throw new Error(`no example satisfies patterns ${spec.patterns.join(", ")} within ${min}..${max}`);
  }
  const formatted = spec.format === undefined ? undefined : FORMAT_VALUES[spec.format];
  if (formatted !== undefined) return formatted;
  const target = Math.min(Math.max(min, 5), max);
  return "example".repeat(Math.ceil(target / 7)).slice(0, target);
}

function exampleNumber(spec: Extract<FieldSpec, { kind: "number" }>): number {
  let value = spec.min ?? (spec.max !== undefined ? Math.min(spec.max, 1) : 1);
  if (spec.multipleOf !== undefined) value = Math.ceil(value / spec.multipleOf) * spec.multipleOf;
  if (spec.integer) value = Math.ceil(value);
  return value;
}

export function exampleValue(spec: FieldSpec, depth = 0): unknown {
  switch (spec.kind) {
    case "string":
      return exampleString(spec);
    case "number":
      return exampleNumber(spec);
    case "boolean":
      return true;
    case "enum":
      return spec.values[0];
    case "temporal":
      return TEMPORAL_VALUES[spec.temporal] ?? TEMPORAL_VALUES["date-time"];
    case "record":
      return { key: "value" };
    case "schema":
      return buildExample(spec.example(), depth + 1);
    case "unknown":
      return "value";
  }
}

function entryValue(entry: FieldEntry, depth: number): unknown {
  const item = exampleValue(entry.spec, depth);
  if (entry.array === undefined) return item;
  return Array.from({ length: Math.max(entry.array.min ?? 1, 1) }, () => item);
}

function operandValue(operand: Operand, object: Record<string, unknown>): unknown {
  if ("field" in operand) return object[operand.field];
  if ("literal" in operand) return operand.literal;
  const values = operand.terms.map((term) => Number(operandValue(term, object)));
  return values.slice(1).reduce((total, value) => {
    if (operand.operator === "add") return total + value;
    if (operand.operator === "subtract") return total - value;
    if (operand.operator === "multiply") return total * value;
    return total / value;
  }, values[0] ?? 0);
}

/** Adjusts the left field of a comparison so the comparison holds. */
function distinctFrom(value: unknown, spec: FieldSpec | undefined): unknown {
  if (typeof value === "number") return value + 1;
  if (spec?.kind === "string" && spec.format !== undefined && FORMAT_ALTERNATES[spec.format]) {
    return FORMAT_ALTERNATES[spec.format];
  }
  if (spec?.kind === "enum") return spec.values.find((item) => item !== value) ?? value;
  const text = String(value);
  return text.length > 0 ? `${text.slice(0, -1)}${text.at(-1) === "z" ? "y" : "z"}` : "z";
}

function satisfy(
  comparison: Comparison,
  object: Record<string, unknown>,
  specs: ReadonlyMap<string, FieldSpec>,
): void {
  if (!("field" in comparison.left)) return;
  const target = operandValue(comparison.right, object);
  const field = comparison.left.field;
  const step = typeof target === "number" ? 1 : 0;
  switch (comparison.operator) {
    case "equal":
      object[field] = target;
      return;
    case "not-equal":
      if (object[field] === target) object[field] = distinctFrom(target, specs.get(field));
      return;
    case "greater-than":
      object[field] = (target as number) + step;
      return;
    case "greater-than-or-equal":
    case "less-than-or-equal":
      object[field] = target;
      return;
    case "less-than":
      object[field] = (target as number) - step;
      return;
  }
}

/** A valid example: every field present (optional ones too), nested to a bounded depth. */
export function buildExample(example: SchemaExample, depth = 0): Record<string, unknown> {
  const object: Record<string, unknown> = {};
  for (const entry of example.fields) {
    if (entry.optional && (depth >= MAX_DEPTH || entry.spec.kind === "schema")) continue;
    object[entry.name] = entryValue(entry, depth);
  }
  const specs = new Map(example.fields.map((entry) => [entry.name, entry.spec] as const));
  for (const invariant of example.invariants) {
    const comparisons = invariant.any ? invariant.comparisons.slice(0, 1) : invariant.comparisons;
    for (const comparison of comparisons) satisfy(comparison, object, specs);
  }
  return object;
}

function without(object: Record<string, unknown>, field: string): Record<string, unknown> {
  const copy = { ...object };
  delete copy[field];
  return copy;
}

function withValue(object: Record<string, unknown>, field: string, value: unknown) {
  return { ...object, [field]: value };
}

function wrongType(spec: FieldSpec): unknown | undefined {
  switch (spec.kind) {
    case "string":
    case "temporal":
    case "enum":
      return 12345;
    case "number":
      return "not-a-number";
    case "boolean":
      return "not-a-boolean";
    case "record":
    case "schema":
      return "not-an-object";
    case "unknown":
      return undefined;
  }
}

function itemViolations(spec: FieldSpec): Array<{ reason: string; value: unknown }> {
  const found: Array<{ reason: string; value: unknown }> = [];
  const type = wrongType(spec);
  if (type !== undefined) found.push({ reason: "wrong type", value: type });
  if (spec.kind === "string") {
    const [min, max] = stringBounds(spec);
    const base = exampleString(spec);
    // Only lengths the contract declares; an undeclared minimum accepts "".
    if ((spec.exactLength !== undefined || spec.minLength !== undefined) && min > 0) {
      found.push({ reason: `shorter than ${min}`, value: base.slice(0, min - 1) });
    }
    if (spec.maxLength !== undefined || spec.exactLength !== undefined) {
      found.push({ reason: `longer than ${max}`, value: base.padEnd(max + 1, base.at(-1) ?? "a") });
    }
    if (spec.format !== undefined && FORMAT_VALUES[spec.format] !== undefined) {
      found.push({ reason: `not a ${spec.format}`, value: "!".repeat(Math.max(min, 1)) });
    }
    if (spec.patterns && spec.patterns.length > 0) {
      const candidate = "!".repeat(Math.max(min, 1));
      if (!matchesPatterns(candidate, spec.patterns)) {
        found.push({ reason: "does not match the pattern", value: candidate });
      }
    }
  }
  if (spec.kind === "number") {
    if (spec.min !== undefined) found.push({ reason: `below ${spec.min}`, value: spec.min - 1 });
    if (spec.max !== undefined) found.push({ reason: `above ${spec.max}`, value: spec.max + 1 });
    if (spec.integer) found.push({ reason: "not an integer", value: exampleNumber(spec) + 0.5 });
  }
  if (spec.kind === "enum") found.push({ reason: "not an allowed value", value: "__not_allowed__" });
  if (spec.kind === "temporal") found.push({ reason: "not an ISO-8601 value", value: "not-a-date" });
  return found;
}

/** One violation per contract constraint, each applied to an otherwise valid example. */
export function violations(example: SchemaExample): Violation[] {
  const valid = buildExample(example);
  const found: Violation[] = [];
  for (const entry of example.fields) {
    // An `unknown` field accepts anything, including nothing.
    if (!entry.optional && entry.spec.kind !== "unknown") {
      found.push({ field: entry.name, reason: "missing", value: without(valid, entry.name) });
      if (!entry.nullable) {
        found.push({ field: entry.name, reason: "null", value: withValue(valid, entry.name, null) });
      }
    }
    for (const item of itemViolations(entry.spec)) {
      const value = entry.array === undefined ? item.value : [item.value];
      found.push({ field: entry.name, reason: item.reason, value: withValue(valid, entry.name, value) });
    }
    if (entry.array !== undefined) {
      const element = entryValue({ ...entry, array: undefined }, 0);
      found.push({ field: entry.name, reason: "not an array", value: withValue(valid, entry.name, element) });
      if ((entry.array.min ?? 0) > 0) {
        found.push({
          field: entry.name,
          reason: `fewer than ${entry.array.min} items`,
          value: withValue(valid, entry.name, Array.from({ length: (entry.array.min ?? 1) - 1 }, () => element)),
        });
      }
      if (entry.array.max !== undefined) {
        found.push({
          field: entry.name,
          reason: `more than ${entry.array.max} items`,
          value: withValue(valid, entry.name, Array.from({ length: entry.array.max + 1 }, () => element)),
        });
      }
    }
  }
  return found;
}

/** A schema example that builds its own valid value and violations, for other packs' tests. */
export interface ContractExample extends SchemaExample {
  valid(): Record<string, unknown>;
  violations(): Violation[];
}

export function contractExample(shape: SchemaExample): ContractExample {
  return { ...shape, valid: () => buildExample(shape), violations: () => violations(shape) };
}
