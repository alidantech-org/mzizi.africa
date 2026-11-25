import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { CommitmentKind } from "#/modules/politics/schema/enum/commitment-kind.enum.ts";
import { commitmentEntryFulfilmentsExample } from "@test/modules/politics/schema/dto/examples/commitment-entry-fulfilments.dto.example.ts";

/** The contract shape of CommitmentEntry, for generated tests. */
export const commitmentEntryExample: ContractExample = contractExample({
  name: "CommitmentEntry",
  fields: [
    {
      name: "code",
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
      name: "commitmentId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "dueOn",
      optional: false,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "fulfilments",
      optional: false,
      nullable: false,
      array: {},
      spec: {
        kind: "schema",
        example: () => commitmentEntryFulfilmentsExample,
      },
    },
    {
      name: "kind",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(CommitmentKind) },
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
      name: "madeOn",
      optional: false,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "placeId",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "quantity",
      optional: false,
      nullable: true,
      spec: { kind: "number" },
    },
    {
      name: "statement",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 8000 },
    },
    {
      name: "statusAsOf",
      optional: false,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "statusTerm",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "topicTerm",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
  ],
  invariants: [],
});
