import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { instrumentDetailEditionsExample } from "@test/modules/legal/schema/dto/examples/instrument-detail-editions.dto.example.ts";
import { instrumentDetailNamesExample } from "@test/modules/legal/schema/dto/examples/instrument-detail-names.dto.example.ts";

/** The contract shape of InstrumentDetail, for generated tests. */
export const instrumentDetailExample: ContractExample = contractExample({
  name: "InstrumentDetail",
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
      name: "editions",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => instrumentDetailEditionsExample },
    },
    {
      name: "enactedOn",
      optional: false,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "instrumentId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "issuerId",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "kindTerm",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "names",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => instrumentDetailNamesExample },
    },
    {
      name: "publishedOn",
      optional: false,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "statusTerm",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
  ],
  invariants: [],
});
