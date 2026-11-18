import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of HostedStation, for generated tests. */
export const hostedStationExample: ContractExample = contractExample({
  name: "HostedStation",
  fields: [
    {
      name: "ballotsCast",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true, min: 0 },
    },
    {
      name: "electionCode",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 255 },
    },
    {
      name: "electionYear",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true },
    },
    {
      name: "registeredVoters",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true, min: 0 },
    },
    {
      name: "stationName",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "statusLabel",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "streamCount",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true, min: 0 },
    },
  ],
  invariants: [],
});
