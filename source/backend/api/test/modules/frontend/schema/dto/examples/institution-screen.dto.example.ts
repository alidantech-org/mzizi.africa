import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { officeRowExample } from "@test/modules/frontend/schema/dto/examples/office-row.dto.example.ts";
import { localizedTextExample } from "@test/modules/shared/schema/dto/examples/localized-text.dto.example.ts";

/** The contract shape of InstitutionScreen, for generated tests. */
export const institutionScreenExample: ContractExample = contractExample({
  name: "InstitutionScreen",
  fields: [
    {
      name: "arm",
      optional: true,
      nullable: false,
      spec: { kind: "schema", example: () => localizedTextExample },
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
      name: "language",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 255 },
    },
    {
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => localizedTextExample },
    },
    {
      name: "offices",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => officeRowExample },
    },
  ],
  invariants: [],
});
