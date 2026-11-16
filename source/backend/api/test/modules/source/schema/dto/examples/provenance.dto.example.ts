import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { entityExample } from "@test/modules/shared/schema/dto/examples/entity.dto.example.ts";
import { capturesExample } from "@test/modules/source/schema/dto/examples/captures.dto.example.ts";
import { datasetsExample } from "@test/modules/source/schema/dto/examples/datasets.dto.example.ts";
import { documentsExample } from "@test/modules/source/schema/dto/examples/documents.dto.example.ts";

/** The contract shape of Provenance, for generated tests. */
export const provenanceExample: ContractExample = contractExample({
  name: "Provenance",
  fields: [
    {
      name: "captureId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "columnName",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 100 },
    },
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "datasetId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "deletedAt",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "documentId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "line",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true, min: 1 },
    },
    {
      name: "recordId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "tableName",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 100 },
    },
    {
      name: "updatedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "version",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 1 },
    },
  ],
  invariants: [],
});
