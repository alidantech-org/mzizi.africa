import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";

/** The contract shape of CandidateIssue, for generated tests. */
export const candidateIssueExample: ContractExample = contractExample({
  name: "CandidateIssue",
  fields: [
    {
      name: "message",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 0, maxLength: 5000 },
    },
    {
      name: "rule",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "severity",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
  ],
  invariants: [
  ],
});