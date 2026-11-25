import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { projectDetailContractsExample } from "@test/modules/civic/schema/dto/examples/project-detail-contracts.dto.example.ts";
import { projectDetailNamesExample } from "@test/modules/civic/schema/dto/examples/project-detail-names.dto.example.ts";
import { projectDetailSitesExample } from "@test/modules/civic/schema/dto/examples/project-detail-sites.dto.example.ts";

/** The contract shape of ProjectDetail, for generated tests. */
export const projectDetailExample: ContractExample = contractExample({
  name: "ProjectDetail",
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
      name: "contracts",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => projectDetailContractsExample },
    },
    {
      name: "fromYear",
      optional: false,
      nullable: true,
      spec: { kind: "number", integer: true, min: -10000, max: 3000 },
    },
    {
      name: "implementerId",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "institutionId",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "names",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => projectDetailNamesExample },
    },
    {
      name: "projectId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "sites",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => projectDetailSitesExample },
    },
    {
      name: "sponsorId",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "statusTerm",
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
