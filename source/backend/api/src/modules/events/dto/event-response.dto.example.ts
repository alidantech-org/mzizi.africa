import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { eventPublicExample } from "#/modules/events/dto/event-public.dto.example.ts";

/** The contract shape of EventResponse, for generated tests. */
export const eventResponseExample: ContractExample = contractExample({
  name: "EventResponse",
  fields: [
    {
      name: "event",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => eventPublicExample },
    },
  ],
  invariants: [
  ],
});