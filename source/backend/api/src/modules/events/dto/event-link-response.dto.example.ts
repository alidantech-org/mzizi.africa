import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { eventLinkPublicExample } from "#/modules/events/dto/event-link-public.dto.example.ts";

/** The contract shape of EventLinkResponse, for generated tests. */
export const eventLinkResponseExample: ContractExample = contractExample({
  name: "EventLinkResponse",
  fields: [
    {
      name: "link",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => eventLinkPublicExample },
    },
  ],
  invariants: [
  ],
});