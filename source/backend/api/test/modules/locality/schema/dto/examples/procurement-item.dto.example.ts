import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { evidenceRefExample } from "@test/modules/locality/schema/dto/examples/evidence-ref.dto.example.ts";

/** The contract shape of ProcurementItem, for generated tests. */
export const procurementItemExample: ContractExample = contractExample({
  name: "ProcurementItem",
  fields: [
    {
      name: "amount",
      optional: true,
      nullable: true,
      spec: { kind: "number", min: 0 },
    },
    {
      name: "awardedTo",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "currency",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 100 },
    },
    {
      name: "evidence",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => evidenceRefExample },
    },
    {
      name: "procurementId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "status",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 100 },
    },
    {
      name: "title",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "year",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true },
    },
  ],
  invariants: [],
});
