import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { capturePublicExample } from "#/modules/source/dto/capture-public.dto.example.ts";

/** The contract shape of CaptureResponse, for generated tests. */
export const captureResponseExample: ContractExample = contractExample({
  name: "CaptureResponse",
  fields: [
    {
      name: "capture",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => capturePublicExample },
    },
  ],
  invariants: [
  ],
});