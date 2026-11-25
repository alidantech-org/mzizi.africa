import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { localizedTextExample } from "@test/modules/shared/schema/dto/examples/localized-text.dto.example.ts";

/** The contract shape of CountryLink, for generated tests. */
export const countryLinkExample: ContractExample = contractExample({
  name: "CountryLink",
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
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "isoAlpha2",
      optional: true,
      nullable: true,
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
