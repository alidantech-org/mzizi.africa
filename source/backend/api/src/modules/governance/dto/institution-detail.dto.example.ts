import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { institutionDetailMandatesExample } from "#/modules/governance/dto/institution-detail-mandates.dto.example.ts";
import { institutionDetailNamesExample } from "#/modules/governance/dto/institution-detail-names.dto.example.ts";
import { institutionDetailOfficesExample } from "#/modules/governance/dto/institution-detail-offices.dto.example.ts";

/** The contract shape of InstitutionDetail, for generated tests. */
export const institutionDetailExample: ContractExample = contractExample({
  name: "InstitutionDetail",
  fields: [
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 255, patterns: ["^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*){0,15}$"] },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "kind",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 255, patterns: ["^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*){0,15}$"] },
    },
    {
      name: "mandates",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => institutionDetailMandatesExample },
    },
    {
      name: "names",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => institutionDetailNamesExample },
    },
    {
      name: "offices",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => institutionDetailOfficesExample },
    },
    {
      name: "validFrom",
      optional: false,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "validUntil",
      optional: false,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
  ],
  invariants: [
  ],
});