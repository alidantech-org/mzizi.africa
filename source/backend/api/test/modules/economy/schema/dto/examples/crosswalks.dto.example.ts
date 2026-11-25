import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { CrosswalkKind } from "#/modules/economy/schema/enum/crosswalk-kind.enum.ts";
import { associationExample } from "@test/modules/shared/schema/dto/examples/association.dto.example.ts";
import { termsExample } from "@test/modules/vocabulary/schema/dto/examples/terms.dto.example.ts";

/** The contract shape of Crosswalks, for generated tests. */
export const crosswalksExample: ContractExample = contractExample({
  name: "Crosswalks",
  fields: [
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "deletedAt",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "fromSchemeTerm",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "fromValue",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 50 },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "kind",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(CrosswalkKind) },
    },
    {
      name: "toSchemeTerm",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "toValue",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 50 },
    },
  ],
  invariants: [],
});
