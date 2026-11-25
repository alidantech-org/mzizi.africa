import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { articleEntryExample } from "@test/modules/media/schema/dto/examples/article-entry.dto.example.ts";

/** The contract shape of ArticleCollection, for generated tests. */
export const articleCollectionExample: ContractExample = contractExample({
  name: "ArticleCollection",
  fields: [
    {
      name: "articles",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => articleEntryExample },
    },
  ],
  invariants: [],
});
