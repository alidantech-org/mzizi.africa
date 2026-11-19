import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { placeCivicClassesExample } from "@test/modules/insights/schema/dto/examples/place-civic-classes.dto.example.ts";
import { placeCivicFundExample } from "@test/modules/insights/schema/dto/examples/place-civic-fund.dto.example.ts";
import { placeCivicInfrastructureExample } from "@test/modules/insights/schema/dto/examples/place-civic-infrastructure.dto.example.ts";
import { placeCivicLeadershipExample } from "@test/modules/insights/schema/dto/examples/place-civic-leadership.dto.example.ts";
import { placeCivicProjectsExample } from "@test/modules/insights/schema/dto/examples/place-civic-projects.dto.example.ts";
import { placeCivicYearsExample } from "@test/modules/insights/schema/dto/examples/place-civic-years.dto.example.ts";
import { placeCrumbExample } from "@test/modules/insights/schema/dto/examples/place-crumb.dto.example.ts";

/** The contract shape of PlaceCivic, for generated tests. */
export const placeCivicExample: ContractExample = contractExample({
  name: "PlaceCivic",
  fields: [
    {
      name: "chain",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => placeCrumbExample },
    },
    {
      name: "classes",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => placeCivicClassesExample },
    },
    {
      name: "fund",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => placeCivicFundExample },
    },
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "infrastructure",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => placeCivicInfrastructureExample },
    },
    {
      name: "leadership",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => placeCivicLeadershipExample },
    },
    {
      name: "place",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => placeCrumbExample },
    },
    {
      name: "projects",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => placeCivicProjectsExample },
    },
    {
      name: "years",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => placeCivicYearsExample },
    },
  ],
  invariants: [],
});
