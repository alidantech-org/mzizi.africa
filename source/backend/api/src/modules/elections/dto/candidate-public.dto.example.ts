import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { NominationStatus } from "#/types/elections/nomination-status.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import { seatExample } from "#/modules/elections/dto/seat.dto.example.ts";

/** The contract shape of CandidatePublic, for generated tests. */
export const candidatePublicExample: ContractExample = contractExample({
  name: "CandidatePublic",
  fields: [
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "isCurrent",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "isIndependent",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "nominationStatus",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(NominationStatus) },
    },
    {
      name: "partyId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "personId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "seatId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "updatedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "validFrom",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "validFromPrecision",
      optional: true,
      nullable: true,
      spec: { kind: "enum", values: Object.values(DatePrecision) },
    },
    {
      name: "validTo",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "validToPrecision",
      optional: true,
      nullable: true,
      spec: { kind: "enum", values: Object.values(DatePrecision) },
    },
    {
      name: "version",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0 },
    },
  ],
  invariants: [
  ],
});