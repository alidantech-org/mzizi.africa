import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { verificationPublicExample } from "#/modules/source/dto/verification-public.dto.example.ts";

/** The contract shape of VerificationResponse, for generated tests. */
export const verificationResponseExample: ContractExample = contractExample({
  name: "VerificationResponse",
  fields: [
    {
      name: "verification",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => verificationPublicExample },
    },
  ],
  invariants: [
  ],
});