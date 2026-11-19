import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { contentListCategoriesExample } from "@test/modules/insights/schema/dto/examples/content-list-categories.dto.example.ts";
import { contentListItemsExample } from "@test/modules/insights/schema/dto/examples/content-list-items.dto.example.ts";

/** The contract shape of ContentList, for generated tests. */
export const contentListExample: ContractExample = contractExample({
  name: "ContentList",
  fields: [
    {
      name: "categories",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => contentListCategoriesExample },
    },
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "items",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => contentListItemsExample },
    },
  ],
  invariants: [],
});
