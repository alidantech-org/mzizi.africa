import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { baseEntityExample } from "#/modules/shared/dto/base-entity.dto.example.ts";

/** The contract shape of Comment, for generated tests. */
export const commentExample: ContractExample = contractExample({
  name: "Comment",
  fields: [
    {
      name: "actorId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "body",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1 },
    },
    {
      name: "createdAt",
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
      name: "parentCommentId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
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