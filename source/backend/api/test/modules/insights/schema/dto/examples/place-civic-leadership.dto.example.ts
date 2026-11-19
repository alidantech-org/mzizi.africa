import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { placeCivicLeadershipEvidenceExample } from "@test/modules/insights/schema/dto/examples/place-civic-leadership-evidence.dto.example.ts";

/** The contract shape of PlaceCivicLeadership, for generated tests. */
export const placeCivicLeadershipExample: ContractExample = contractExample({
  name: "PlaceCivicLeadership",
  fields: [
    {
      name: "evidence",
      optional: false,
      nullable: false,
      array: {},
      spec: {
        kind: "schema",
        example: () => placeCivicLeadershipEvidenceExample,
      },
    },
    {
      name: "holderId",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "leaderSlug",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "leftOfficeOn",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "officeCode",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "officeTitle",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "partyName",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "personName",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "portrait",
      optional: true,
      nullable: true,
      spec: { kind: "unknown" },
    },
    {
      name: "tookOfficeOn",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "unitFeatureId",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "unitName",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
