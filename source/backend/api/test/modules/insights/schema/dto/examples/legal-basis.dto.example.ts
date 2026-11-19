import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { legalBasisItemsExample } from "@test/modules/insights/schema/dto/examples/legal-basis-items.dto.example.ts";
import { legalBasisSubjectExample } from "@test/modules/insights/schema/dto/examples/legal-basis-subject.dto.example.ts";

/** The contract shape of LegalBasis, for generated tests. */
export const legalBasisExample: ContractExample = contractExample({
  name: "LegalBasis",
  fields: [
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
      spec: { kind: "schema", example: () => legalBasisItemsExample },
    },
    {
      name: "subject",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => legalBasisSubjectExample },
    },
  ],
  invariants: [],
});
