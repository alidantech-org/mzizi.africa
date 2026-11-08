import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { ActorRole } from "#/types/shared/actor-role.enum.ts";

/** The contract shape of ActorContext, for generated tests. */
export const actorContextExample: ContractExample = contractExample({
  name: "ActorContext",
  fields: [
    {
      name: "actorId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "role",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(ActorRole) },
    },
  ],
  invariants: [
  ],
});