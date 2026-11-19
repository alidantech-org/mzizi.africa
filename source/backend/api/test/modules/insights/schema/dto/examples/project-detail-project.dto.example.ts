import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of ProjectDetailProject, for generated tests. */
export const projectDetailProjectExample: ContractExample = contractExample({
  name: "ProjectDetailProject",
  fields: [
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "completedOn",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "description",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "location",
      optional: false,
      nullable: false,
      spec: { kind: "unknown" },
    },
    {
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "responsible",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "startedOn",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "status",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "unit",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "unitId",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "unitPath",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
