"use client";

import { useEffect, useState } from "react";

import { DryvForm } from "../../../components/dryv/dryv-form.tsx";
import { DryvResult } from "../../../components/dryv/dryv-result.tsx";
import type { ClientResponse } from "../../../lib/dryv/transport.ts";
import { listCapabilities } from "./../../../_gen/actions/engine/list-capabilities.actions.ts";
import {
  listCapabilitiesInputFields,
  listCapabilitiesOutputFields,
  listCapabilitiesRequest,
} from "./../../../lib/api/engine/list-capabilities.ts";

/**
 * Capability List
 */
export default function CapabilityListPage() {
  const [results, setResults] = useState<
    Record<string, ClientResponse<unknown>>
  >({});
  const keep = (operation: string) => (response: ClientResponse<unknown>) => {
    setResults((current) => ({ ...current, [operation]: response }));
    return response;
  };

  useEffect(() => {
    void listCapabilities(listCapabilitiesRequest() as never).then(
      keep("listCapabilities"),
    );
  }, []);

  return (
    <main className="dryv-page">
      <h1>Capability List</h1>

      <section className="dryv-part" data-part="capabilities">
        <h2>Capabilities</h2>
        <DryvResult
          response={results["listCapabilities"]}
          fields={listCapabilitiesOutputFields}
        />
      </section>
    </main>
  );
}
