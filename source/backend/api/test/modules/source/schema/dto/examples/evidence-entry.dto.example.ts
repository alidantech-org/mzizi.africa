import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { EvidenceMethod } from "#/modules/source/schema/enum/evidence-method.enum.ts";
import { EvidenceRole } from "#/modules/source/schema/enum/evidence-role.enum.ts";

/** The contract shape of EvidenceEntry, for generated tests. */
export const evidenceEntryExample: ContractExample = contractExample({
  name: "EvidenceEntry",
  fields: [
    {
      name: "artifactId",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "confidence",
      optional: false,
      nullable: true,
      spec: { kind: "number", min: 0, max: 1 },
    },
    {
      name: "editionDesignation",
      optional: false,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 255 },
    },
    {
      name: "evidenceId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "locator",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 4000 },
    },
    {
      name: "locatorTerm",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "method",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(EvidenceMethod) },
    },
    {
      name: "observedAt",
      optional: false,
      nullable: true,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "productCode",
      optional: false,
      nullable: true,
      spec: {
        kind: "string",
        minLength: 1,
        maxLength: 255,
        patterns: [
          "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ],
      },
    },
    {
      name: "publisherCode",
      optional: false,
      nullable: true,
      spec: {
        kind: "string",
        minLength: 1,
        maxLength: 255,
        patterns: [
          "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ],
      },
    },
    {
      name: "role",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(EvidenceRole) },
    },
  ],
  invariants: [],
});
