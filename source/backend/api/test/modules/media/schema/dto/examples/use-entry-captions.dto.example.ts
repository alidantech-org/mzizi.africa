import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of UseEntryCaptions, for generated tests. */
export const useEntryCaptionsExample: ContractExample = contractExample({
  name: "UseEntryCaptions",
  fields: [
    {
      name: "altText",
      optional: false,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 1000 },
    },
    {
      name: "languageCode",
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
      name: "title",
      optional: false,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
  ],
  invariants: [],
});
