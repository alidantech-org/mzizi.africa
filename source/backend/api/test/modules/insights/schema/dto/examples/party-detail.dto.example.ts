import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { partyDetailFundingExample } from "@test/modules/insights/schema/dto/examples/party-detail-funding.dto.example.ts";
import { partyDetailMembersExample } from "@test/modules/insights/schema/dto/examples/party-detail-members.dto.example.ts";
import { partyDetailPartyExample } from "@test/modules/insights/schema/dto/examples/party-detail-party.dto.example.ts";
import { partyDetailResultsExample } from "@test/modules/insights/schema/dto/examples/party-detail-results.dto.example.ts";

/** The contract shape of PartyDetail, for generated tests. */
export const partyDetailExample: ContractExample = contractExample({
  name: "PartyDetail",
  fields: [
    {
      name: "funding",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => partyDetailFundingExample },
    },
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "members",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => partyDetailMembersExample },
    },
    {
      name: "party",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => partyDetailPartyExample },
    },
    {
      name: "results",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => partyDetailResultsExample },
    },
  ],
  invariants: [],
});
