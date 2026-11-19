import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { contentPageContentExample } from "@test/modules/insights/schema/dto/examples/content-page-content.dto.example.ts";
import { contentPageRelatedExample } from "@test/modules/insights/schema/dto/examples/content-page-related.dto.example.ts";

/** The contract shape of ContentPage, for generated tests. */
export const contentPageExample: ContractExample = contractExample({
  name: "ContentPage",
  fields: [
    {
      name: "content",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => contentPageContentExample },
    },
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "related",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => contentPageRelatedExample },
    },
  ],
  invariants: [],
});
