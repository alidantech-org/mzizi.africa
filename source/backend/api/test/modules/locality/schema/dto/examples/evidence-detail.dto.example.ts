import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { evidenceRefExample } from "@test/modules/locality/schema/dto/examples/evidence-ref.dto.example.ts";
import { mediaRefExample } from "@test/modules/locality/schema/dto/examples/media-ref.dto.example.ts";

/** The contract shape of EvidenceDetail, for generated tests. */
export const evidenceDetailExample: ContractExample = contractExample({
  name: "EvidenceDetail",
  fields: [
    {
      name: "editionLabel",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "evidence",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => evidenceRefExample },
    },
    {
      name: "files",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => mediaRefExample },
    },
    {
      name: "quotedText",
      optional: true,
      nullable: true,
      spec: { kind: "string", maxLength: 4000 },
    },
    {
      name: "sourceCode",
      optional: true,
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
      name: "sourceId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
  ],
  invariants: [],
});
