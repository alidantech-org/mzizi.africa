import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { StructureOwnerKind } from "#/types/website/structure-owner-kind.enum.ts";
import { StructureStatus } from "#/types/website/structure-status.enum.ts";

/** The contract shape of StructurePublic, for generated tests. */
export const structurePublicExample: ContractExample = contractExample({
  name: "StructurePublic",
  fields: [
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "currentVersionId",
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
      name: "ownerId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "ownerKind",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(StructureOwnerKind) },
    },
    {
      name: "purpose",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 100 },
    },
    {
      name: "status",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(StructureStatus) },
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