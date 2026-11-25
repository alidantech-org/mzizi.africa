import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { localizedTextExample } from "@test/modules/shared/schema/dto/examples/localized-text.dto.example.ts";

/** The contract shape of SearchHit, for generated tests. */
export const searchHitExample: ContractExample = contractExample({
  name: "SearchHit",
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
      name: "context",
      optional: true,
      nullable: false,
      spec: { kind: "schema", example: () => localizedTextExample },
    },
    {
      name: "kind",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 100 },
    },
    {
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => localizedTextExample },
    },
  ],
  invariants: [],
});
