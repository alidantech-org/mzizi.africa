import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { ResultStatus } from "#/types/elections/result-status.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import { electionExample } from "#/modules/elections/dto/election.dto.example.ts";

/** The contract shape of ElectoratePublic, for generated tests. */
export const electoratePublicExample: ContractExample = contractExample({
  name: "ElectoratePublic",
  fields: [
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "declaredAt",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "declaringInstitutionId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "electionId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "evidenceForm",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 120 },
    },
    {
      name: "geoUnitId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
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
      name: "registerVersion",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 200 },
    },
    {
      name: "registeredVoters",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true, min: 0 },
    },
    {
      name: "rejectedVotes",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true, min: 0 },
    },
    {
      name: "resultLevelId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "resultStatus",
      optional: true,
      nullable: true,
      spec: { kind: "enum", values: Object.values(ResultStatus) },
    },
    {
      name: "seatId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "spoiltVotes",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true, min: 0 },
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
      name: "validVotes",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true, min: 0 },
    },
    {
      name: "version",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0 },
    },
    {
      name: "votesCast",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true, min: 0 },
    },
  ],
  invariants: [
  ],
});