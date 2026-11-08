import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { baseEntityExample } from "#/modules/shared/dto/base-entity.dto.example.ts";

/** The contract shape of EvidenceReference, for generated tests. */
export const evidenceReferenceExample: ContractExample = contractExample({
  name: "EvidenceReference",
  fields: [
    {
      name: "actorId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "fileId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "note",
      optional: true,
      nullable: true,
      spec: { kind: "string", maxLength: 4000 },
    },
    {
      name: "targetId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "targetKind",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 2, maxLength: 100 },
    },
    {
      name: "updatedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "version",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0 },
    },
  ],
  invariants: [
  ],
});