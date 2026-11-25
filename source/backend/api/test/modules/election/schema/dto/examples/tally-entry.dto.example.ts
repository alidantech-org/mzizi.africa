import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { FigureBasis } from "#/modules/shared/schema/enum/figure-basis.enum.ts";
import { FigureStatus } from "#/modules/shared/schema/enum/figure-status.enum.ts";

/** The contract shape of TallyEntry, for generated tests. */
export const tallyEntryExample: ContractExample = contractExample({
  name: "TallyEntry",
  fields: [
    {
      name: "basis",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(FigureBasis) },
    },
    {
      name: "candidateId",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "choiceId",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "contestId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "refreshedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "share",
      optional: false,
      nullable: true,
      spec: { kind: "number", min: 0, max: 100 },
    },
    {
      name: "status",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(FigureStatus) },
    },
    {
      name: "votes",
      optional: false,
      nullable: true,
      spec: { kind: "number", integer: true, min: 0 },
    },
  ],
  invariants: [],
});
