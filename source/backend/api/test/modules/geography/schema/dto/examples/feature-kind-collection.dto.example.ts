import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { featureKindExample } from "@test/modules/geography/schema/dto/examples/feature-kind.dto.example.ts";

/** The contract shape of FeatureKindCollection, for generated tests. */
export const featureKindCollectionExample: ContractExample = contractExample({
  name: "FeatureKindCollection",
  fields: [
    {
      name: "kinds",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => featureKindExample },
    },
  ],
  invariants: [],
});
