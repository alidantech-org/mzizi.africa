import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { publisherPublicExample } from "#/modules/source/dto/publisher-public.dto.example.ts";

/** The contract shape of PublisherResponse, for generated tests. */
export const publisherResponseExample: ContractExample = contractExample({
  name: "PublisherResponse",
  fields: [
    {
      name: "publisher",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => publisherPublicExample },
    },
  ],
  invariants: [
  ],
});