"use client";

import { useEffect, useState } from "react";

import { DryvResult } from "#/components/dryv/dryv-result.tsx";
import type { ClientResponse } from "#/lib/dryv/transport.ts";
import { browseFeatures } from "@mzizi/api-client/actions/geography/browse-features.actions.ts";
import {
  browseFeaturesOutputFields,
  browseFeaturesRequest,
} from "#/lib/api/geography/browse-features.ts";

/**
 * Feature List
 */
export default function FeatureListPage() {
  const [results, setResults] = useState<Record<string, ClientResponse<unknown>>>({});
  const keep = (operation: string) => (response: ClientResponse<unknown>) => {
    setResults((current) => ({ ...current, [operation]: response }));
    return response;
  };

  useEffect(() => {
    void browseFeatures(browseFeaturesRequest() as never).then(keep("browseFeatures"));
  }, []);

  return (
    <main className="dryv-page">
      <h1>Feature List</h1>

      <section className="dryv-part" data-part="features">
        <h2>Features</h2>
        <DryvResult
          response={results["browseFeatures"]}
          fields={browseFeaturesOutputFields}
          select={["features"]}
        />
      </section>
    </main>
  );
}
