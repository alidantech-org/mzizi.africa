import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { institutionEntryNamesExample } from "@test/modules/governance/schema/dto/examples/institution-entry-names.dto.example.ts";

/** The contract shape of InstitutionEntry, for generated tests. */
export const institutionEntryExample: ContractExample = contractExample({
  name: "InstitutionEntry",
  fields: [
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: {
        kind: "string",
        minLength: 1,
        maxLength: 255,
        patterns: ["^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*){0,15}$"],
      },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "kind",
      optional: false,
      nullable: false,
      spec: {
        kind: "string",
        minLength: 1,
        maxLength: 255,
        patterns: ["^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*){0,15}$"],
      },
    },
    {
      name: "names",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => institutionEntryNamesExample },
    },
  ],
  invariants: [],
});
