import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of PlaceCivicLeadershipEvidence, for generated tests. */
export const placeCivicLeadershipEvidenceExample: ContractExample = contractExample({
  name: "PlaceCivicLeadershipEvidence",
  fields: [
    {
      name: "artifactTitle",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "citationId",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "confidence",
      optional: true,
      nullable: true,
      spec: { kind: "number" },
    },
    {
      name: "locator",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "publisherName",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "retrievedAt",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "sourceName",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "verification",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
