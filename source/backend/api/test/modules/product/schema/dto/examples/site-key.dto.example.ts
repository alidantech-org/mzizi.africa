import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of SiteKey, for generated tests. */
export const siteKeyExample: ContractExample = contractExample({
  name: "SiteKey",
  fields: [
    {
      name: "host",
      optional: false,
      nullable: false,
      spec: {
        kind: "string",
        minLength: 3,
        maxLength: 253,
        patterns: ["^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$"],
      },
    },
  ],
  invariants: [],
});
