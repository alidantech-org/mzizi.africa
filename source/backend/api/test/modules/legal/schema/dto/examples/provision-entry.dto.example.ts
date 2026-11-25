import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { ProvisionKind } from "#/modules/legal/schema/enum/provision-kind.enum.ts";
import { provisionEntryWordingsExample } from "@test/modules/legal/schema/dto/examples/provision-entry-wordings.dto.example.ts";

/** The contract shape of ProvisionEntry, for generated tests. */
export const provisionEntryExample: ContractExample = contractExample({
  name: "ProvisionEntry",
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
      name: "designation",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 255 },
    },
    {
      name: "kind",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(ProvisionKind) },
    },
    {
      name: "parentId",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "position",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 1 },
    },
    {
      name: "provisionId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "wordings",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => provisionEntryWordingsExample },
    },
  ],
  invariants: [],
});
