import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { partyDetailCoalitionsExample } from "@test/modules/politics/schema/dto/examples/party-detail-coalitions.dto.example.ts";
import { partyDetailNamesExample } from "@test/modules/politics/schema/dto/examples/party-detail-names.dto.example.ts";

/** The contract shape of PartyDetail, for generated tests. */
export const partyDetailExample: ContractExample = contractExample({
  name: "PartyDetail",
  fields: [
    {
      name: "coalitions",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => partyDetailCoalitionsExample },
    },
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
      name: "countryId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "fromYear",
      optional: false,
      nullable: true,
      spec: { kind: "number", integer: true, min: -10000, max: 3000 },
    },
    {
      name: "kindTerm",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "names",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => partyDetailNamesExample },
    },
    {
      name: "partyId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "toYear",
      optional: false,
      nullable: true,
      spec: { kind: "number", integer: true, min: -10000, max: 3000 },
    },
  ],
  invariants: [],
});
