import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { IdentityKind } from "#/modules/shared/schema/enum/identity-kind.enum.ts";
import { associationExample } from "@test/modules/shared/schema/dto/examples/association.dto.example.ts";
import { schemesExample } from "@test/modules/vocabulary/schema/dto/examples/schemes.dto.example.ts";

/** The contract shape of Scopes, for generated tests. */
export const scopesExample: ContractExample = contractExample({
  name: "Scopes",
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
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "identityKind",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(IdentityKind) },
    },
    {
      name: "schemeId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
  ],
  invariants: [],
});
