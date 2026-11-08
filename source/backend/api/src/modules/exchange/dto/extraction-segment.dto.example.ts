import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { SegmentKind } from "#/types/exchange/segment-kind.enum.ts";

/** The contract shape of ExtractionSegment, for generated tests. */
export const extractionSegmentExample: ContractExample = contractExample({
  name: "ExtractionSegment",
  fields: [
    {
      name: "confidence",
      optional: true,
      nullable: false,
      spec: { kind: "number", min: 0, max: 1 },
    },
    {
      name: "content",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 2 },
    },
    {
      name: "key",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "kind",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(SegmentKind) },
    },
    {
      name: "locator",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 2 },
    },
  ],
  invariants: [
  ],
});