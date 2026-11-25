import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { IdentityKind } from "#/modules/shared/schema/enum/identity-kind.enum.ts";
import { identityDetailIdentifiersExample } from "@test/modules/identity/schema/dto/examples/identity-detail-identifiers.dto.example.ts";
import { identityDetailNamesExample } from "@test/modules/identity/schema/dto/examples/identity-detail-names.dto.example.ts";

/** The contract shape of IdentityDetail, for generated tests. */
export const identityDetailExample: ContractExample = contractExample({
  name: "IdentityDetail",
  fields: [
    {
      name: "code",
      optional: false,
      nullable: false,
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
      name: "identifiers",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => identityDetailIdentifiersExample },
    },
    {
      name: "identityId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "kind",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(IdentityKind) },
    },
    {
      name: "names",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => identityDetailNamesExample },
    },
  ],
  invariants: [],
});
