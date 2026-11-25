import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { SchemeAnswers } from "#/modules/vocabulary/schema/enum/scheme-answers.enum.ts";
import { SchemeShape } from "#/modules/vocabulary/schema/enum/scheme-shape.enum.ts";
import { schemeDetailLabelsExample } from "@test/modules/vocabulary/schema/dto/examples/scheme-detail-labels.dto.example.ts";

/** The contract shape of SchemeDetail, for generated tests. */
export const schemeDetailExample: ContractExample = contractExample({
  name: "SchemeDetail",
  fields: [
    {
      name: "answers",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(SchemeAnswers) },
    },
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
      name: "isOpen",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "labels",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => schemeDetailLabelsExample },
    },
    {
      name: "schemeId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "shape",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(SchemeShape) },
    },
  ],
  invariants: [],
});
