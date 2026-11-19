import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { institutionDetailLeadersHowExample } from "@test/modules/insights/schema/dto/examples/institution-detail-leaders-how.dto.example.ts";
import { institutionDetailLeadersTierExample } from "@test/modules/insights/schema/dto/examples/institution-detail-leaders-tier.dto.example.ts";
import { institutionDetailLeadersUnitExample } from "@test/modules/insights/schema/dto/examples/institution-detail-leaders-unit.dto.example.ts";

/** The contract shape of InstitutionDetailLeaders, for generated tests. */
export const institutionDetailLeadersExample: ContractExample = contractExample({
  name: "InstitutionDetailLeaders",
  fields: [
    {
      name: "holderId",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "how",
      optional: false,
      nullable: false,
      spec: {
        kind: "schema",
        example: () => institutionDetailLeadersHowExample,
      },
    },
    {
      name: "leaderSlug",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "officeCode",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "party",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "photo",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "since",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "tier",
      optional: false,
      nullable: false,
      spec: {
        kind: "schema",
        example: () => institutionDetailLeadersTierExample,
      },
    },
    {
      name: "unit",
      optional: true,
      nullable: true,
      spec: {
        kind: "schema",
        example: () => institutionDetailLeadersUnitExample,
      },
    },
  ],
  invariants: [],
});
