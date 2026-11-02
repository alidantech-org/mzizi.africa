import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { ExtractionStatus } from "#/types/exchange/extraction-status.enum.ts";
import { extractionDiagnosticExample } from "#/modules/exchange/dto/extraction-diagnostic.dto.example.ts";
import { extractionSegmentExample } from "#/modules/exchange/dto/extraction-segment.dto.example.ts";
import { fileArtifactRefExample } from "#/modules/exchange/dto/file-artifact-ref.dto.example.ts";

/** The contract shape of ExtractionResult, for generated tests. */
export const extractionResultExample: ContractExample = contractExample({
  name: "ExtractionResult",
  fields: [
    {
      name: "artifact",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => fileArtifactRefExample },
    },
    {
      name: "diagnostics",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => extractionDiagnosticExample },
    },
    {
      name: "extractor",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "extractorVersion",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 40 },
    },
    {
      name: "finishedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "inputHash",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 64, maxLength: 64 },
    },
    {
      name: "profile",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "segments",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => extractionSegmentExample },
    },
    {
      name: "startedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "status",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(ExtractionStatus) },
    },
    {
      name: "structureVersionId",
      optional: true,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "supersedesResultId",
      optional: true,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
  ],
  invariants: [
  ],
});