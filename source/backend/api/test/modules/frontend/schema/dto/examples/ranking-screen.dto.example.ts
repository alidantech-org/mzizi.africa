import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { rankRowExample } from "@test/modules/frontend/schema/dto/examples/rank-row.dto.example.ts";
import { localizedTextExample } from "@test/modules/shared/schema/dto/examples/localized-text.dto.example.ts";

/** The contract shape of RankingScreen, for generated tests. */
export const rankingScreenExample: ContractExample = contractExample({
  name: "RankingScreen",
  fields: [
    {
      name: "indicator",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => localizedTextExample },
    },
    {
      name: "language",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 255 },
    },
    {
      name: "rows",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => rankRowExample },
    },
    {
      name: "unit",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 100 },
    },
    {
      name: "year",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true, min: -10000, max: 3000 },
    },
  ],
  invariants: [],
});
