import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { placeCrumbExample } from "@test/modules/insights/schema/dto/examples/place-crumb.dto.example.ts";

/** The contract shape of IndicatorMap, for generated tests. */
export const indicatorMapExample: ContractExample = contractExample({
  name: "IndicatorMap",
  fields: [
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "indicator",
      optional: false,
      nullable: false,
      spec: { kind: "unknown" },
    },
    {
      name: "parent",
      optional: true,
      nullable: true,
      spec: { kind: "schema", example: () => placeCrumbExample },
    },
    {
      name: "periodFrom",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "units",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
  ],
  invariants: [],
});
