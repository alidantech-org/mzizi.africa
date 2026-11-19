import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of PlaceElectionsElectionsContestsCandidates, for generated tests. */
export const placeElectionsElectionsContestsCandidatesExample: ContractExample = contractExample({
  name: "PlaceElectionsElectionsContestsCandidates",
  fields: [
    {
      name: "individualId",
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
      name: "party",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "partyCode",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "share",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "votes",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "won",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
  ],
  invariants: [],
});
