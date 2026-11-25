import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { PostState } from "#/modules/community/schema/enum/post-state.enum.ts";

/** The contract shape of PostEntry, for generated tests. */
export const postEntryExample: ContractExample = contractExample({
  name: "PostEntry",
  fields: [
    {
      name: "body",
      optional: false,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 20000 },
    },
    {
      name: "displayName",
      optional: false,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 100 },
    },
    {
      name: "handle",
      optional: false,
      nullable: true,
      spec: {
        kind: "string",
        minLength: 3,
        maxLength: 30,
        patterns: ["^[a-z][a-z0-9]*([._][a-z0-9]+)*$"],
      },
    },
    {
      name: "kindTerm",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "languageCode",
      optional: false,
      nullable: true,
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
      name: "postId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "publishedAt",
      optional: false,
      nullable: true,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "rating",
      optional: false,
      nullable: true,
      spec: { kind: "number", integer: true, min: 1, max: 5 },
    },
    {
      name: "state",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(PostState) },
    },
  ],
  invariants: [],
});
