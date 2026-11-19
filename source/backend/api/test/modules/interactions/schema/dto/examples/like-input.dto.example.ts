import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of LikeInput, for generated tests. */
export const likeInputExample: ContractExample = contractExample({
  name: "LikeInput",
  fields: [
    {
      name: "deviceId",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 16, maxLength: 128 },
    },
    {
      name: "subjectRef",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 200 },
    },
    {
      name: "subjectTable",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 3, maxLength: 100 },
    },
  ],
  invariants: [],
});
