import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { LineageRole } from "#/modules/source/schema/enum/lineage-role.enum.ts";
import { entityExample } from "@test/modules/shared/schema/dto/examples/entity.dto.example.ts";
import { capturesExample } from "@test/modules/source/schema/dto/examples/captures.dto.example.ts";
import { datasetsExample } from "@test/modules/source/schema/dto/examples/datasets.dto.example.ts";
import { documentsExample } from "@test/modules/source/schema/dto/examples/documents.dto.example.ts";

/** The contract shape of DatasetLineage, for generated tests. */
export const datasetLineageExample: ContractExample = contractExample({
  name: "DatasetLineage",
  fields: [
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
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "inputCaptureId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "inputDatasetId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "inputDocumentId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "method",
      optional: true,
      nullable: true,
      spec: { kind: "string", maxLength: 4000 },
    },
    {
      name: "role",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(LineageRole) },
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
