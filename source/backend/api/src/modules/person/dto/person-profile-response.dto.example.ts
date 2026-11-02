import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { personProfilePublicExample } from "#/modules/person/dto/person-profile-public.dto.example.ts";

/** The contract shape of PersonProfileResponse, for generated tests. */
export const personProfileResponseExample: ContractExample = contractExample({
  name: "PersonProfileResponse",
  fields: [
    {
      name: "profile",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => personProfilePublicExample },
    },
  ],
  invariants: [
  ],
});