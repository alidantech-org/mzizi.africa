import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { DiagnosticLevel } from "#/types/exchange/diagnostic-level.enum.ts";

/** The contract shape of ExtractionDiagnostic, for generated tests. */
export const extractionDiagnosticExample: ContractExample = contractExample({
  name: "ExtractionDiagnostic",
  fields: [
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "level",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(DiagnosticLevel) },
    },
    {
      name: "locator",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 2 },
    },
    {
      name: "message",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
  ],
  invariants: [
  ],
});