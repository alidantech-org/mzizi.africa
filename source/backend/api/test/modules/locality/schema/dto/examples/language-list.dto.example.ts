import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { languageChoiceExample } from "@test/modules/locality/schema/dto/examples/language-choice.dto.example.ts";

/** The contract shape of LanguageList, for generated tests. */
export const languageListExample: ContractExample = contractExample({
  name: "LanguageList",
  fields: [
    {
      name: "languages",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => languageChoiceExample },
    },
  ],
  invariants: [],
});
