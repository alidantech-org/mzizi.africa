import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { NamePart } from "#/modules/official/schema/enum/name-part.enum.ts";
import { IdentityKind } from "#/modules/shared/schema/enum/identity-kind.enum.ts";
import { namesExample } from "@test/modules/identity/schema/dto/examples/names.dto.example.ts";
import { associationExample } from "@test/modules/shared/schema/dto/examples/association.dto.example.ts";

/** The contract shape of Parts, for generated tests. */
export const partsExample: ContractExample = contractExample({
  name: "Parts",
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
      name: "nameId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "nameKind",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(IdentityKind) },
    },
    {
      name: "part",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(NamePart) },
    },
    {
      name: "position",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0 },
    },
    {
      name: "text",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 255 },
    },
  ],
  invariants: [],
});
