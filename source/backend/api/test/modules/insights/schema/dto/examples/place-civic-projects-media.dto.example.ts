import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of PlaceCivicProjectsMedia, for generated tests. */
export const placeCivicProjectsMediaExample: ContractExample = contractExample({
  name: "PlaceCivicProjectsMedia",
  fields: [
    {
      name: "embedUrl",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "kind",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "mimeType",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "platform",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "stored",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "thumbnailUrl",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "title",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "url",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
