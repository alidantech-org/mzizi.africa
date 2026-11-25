import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { languageChoiceExample } from "@test/modules/shared/schema/dto/examples/language-choice.dto.example.ts";

/** The contract shape of HomeRequest, for generated tests. */
export const homeRequestExample: ContractExample = contractExample({
  name: "HomeRequest",
  fields: [
    {
      name: "host",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 253 },
    },
    {
      name: "lang",
      optional: true,
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
  ],
  invariants: [],
});
