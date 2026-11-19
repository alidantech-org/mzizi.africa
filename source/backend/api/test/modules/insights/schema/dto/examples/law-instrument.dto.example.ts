import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of LawInstrument, for generated tests. */
export const lawInstrumentExample: ContractExample = contractExample({
  name: "LawInstrument",
  fields: [
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 200 },
    },
    {
      name: "enactedOn",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "kindCode",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 200 },
    },
    {
      name: "kindLabel",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "provisions",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0, max: 100000000 },
    },
  ],
  invariants: [],
});
