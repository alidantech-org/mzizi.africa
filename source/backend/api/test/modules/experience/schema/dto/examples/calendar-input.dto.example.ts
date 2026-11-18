import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of CalendarInput, for generated tests. */
export const calendarInputExample: ContractExample = contractExample({
  name: "CalendarInput",
  fields: [
    {
      name: "featureId",
      optional: true,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "from",
      optional: true,
      nullable: false,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "kindCode",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 200 },
    },
    {
      name: "languageCode",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 2, maxLength: 35 },
    },
    {
      name: "to",
      optional: true,
      nullable: false,
      spec: { kind: "temporal", temporal: "date" },
    },
  ],
  invariants: [],
});
