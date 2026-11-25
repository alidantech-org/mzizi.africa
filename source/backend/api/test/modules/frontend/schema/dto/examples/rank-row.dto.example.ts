import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { FigureStatus } from "#/modules/shared/schema/enum/figure-status.enum.ts";
import { localizedTextExample } from "@test/modules/shared/schema/dto/examples/localized-text.dto.example.ts";

/** The contract shape of RankRow, for generated tests. */
export const rankRowExample: ContractExample = contractExample({
  name: "RankRow",
  fields: [
    {
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => localizedTextExample },
    },
    {
      name: "place",
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
      name: "rank",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true, min: 1 },
    },
    {
      name: "status",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(FigureStatus) },
    },
    {
      name: "value",
      optional: true,
      nullable: true,
      spec: { kind: "number" },
    },
  ],
  invariants: [],
});
