import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { classificationRecordPublicExample } from "#/modules/reference/dto/classification-record-public.dto.example.ts";

/** The contract shape of ClassificationRecordResponse, for generated tests. */
export const classificationRecordResponseExample: ContractExample = contractExample({
  name: "ClassificationRecordResponse",
  fields: [
    {
      name: "record",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => classificationRecordPublicExample },
    },
  ],
  invariants: [
  ],
});