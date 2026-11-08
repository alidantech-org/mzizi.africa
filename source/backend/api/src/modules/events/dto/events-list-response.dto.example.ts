import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { eventPublicExample } from "#/modules/events/dto/event-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of EventsListResponse, for generated tests. */
export const eventsListResponseExample: ContractExample = contractExample({
  name: "EventsListResponse",
  fields: [
    {
      name: "events",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => eventPublicExample },
    },
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
  ],
  invariants: [
  ],
});