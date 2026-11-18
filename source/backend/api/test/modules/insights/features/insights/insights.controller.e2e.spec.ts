import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { browseInputExample } from "@test/modules/insights/schema/dto/examples/browse-input.dto.example.ts";
import { compareOptionsInputExample } from "@test/modules/insights/schema/dto/examples/compare-options-input.dto.example.ts";
import { compareOptionsExample } from "@test/modules/insights/schema/dto/examples/compare-options.dto.example.ts";
import { comparisonInputExample } from "@test/modules/insights/schema/dto/examples/comparison-input.dto.example.ts";
import { comparisonExample } from "@test/modules/insights/schema/dto/examples/comparison.dto.example.ts";
import { contentInputExample } from "@test/modules/insights/schema/dto/examples/content-input.dto.example.ts";
import { contentListInputExample } from "@test/modules/insights/schema/dto/examples/content-list-input.dto.example.ts";
import { contentListExample } from "@test/modules/insights/schema/dto/examples/content-list.dto.example.ts";
import { contentPageExample } from "@test/modules/insights/schema/dto/examples/content-page.dto.example.ts";
import { electionDetailExample } from "@test/modules/insights/schema/dto/examples/election-detail.dto.example.ts";
import { electionListExample } from "@test/modules/insights/schema/dto/examples/election-list.dto.example.ts";
import { govTreeInputExample } from "@test/modules/insights/schema/dto/examples/gov-tree-input.dto.example.ts";
import { governanceTabsExample } from "@test/modules/insights/schema/dto/examples/governance-tabs.dto.example.ts";
import { governanceTreeExample } from "@test/modules/insights/schema/dto/examples/governance-tree.dto.example.ts";
import { indicatorMapExample } from "@test/modules/insights/schema/dto/examples/indicator-map.dto.example.ts";
import { indicatorSeriesExample } from "@test/modules/insights/schema/dto/examples/indicator-series.dto.example.ts";
import { institutionDetailExample } from "@test/modules/insights/schema/dto/examples/institution-detail.dto.example.ts";
import { institutionListExample } from "@test/modules/insights/schema/dto/examples/institution-list.dto.example.ts";
import { institutionsInputExample } from "@test/modules/insights/schema/dto/examples/institutions-input.dto.example.ts";
import { leaderProfileExample } from "@test/modules/insights/schema/dto/examples/leader-profile.dto.example.ts";
import { leaderTreeExample } from "@test/modules/insights/schema/dto/examples/leader-tree.dto.example.ts";
import { leaderboardMetricListExample } from "@test/modules/insights/schema/dto/examples/leaderboard-metric-list.dto.example.ts";
import { leaderboardExample } from "@test/modules/insights/schema/dto/examples/leaderboard.dto.example.ts";
import { legalBasisInputExample } from "@test/modules/insights/schema/dto/examples/legal-basis-input.dto.example.ts";
import { legalBasisExample } from "@test/modules/insights/schema/dto/examples/legal-basis.dto.example.ts";
import { motionDetailExample } from "@test/modules/insights/schema/dto/examples/motion-detail.dto.example.ts";
import { motionListExample } from "@test/modules/insights/schema/dto/examples/motion-list.dto.example.ts";
import { motionsInputExample } from "@test/modules/insights/schema/dto/examples/motions-input.dto.example.ts";
import { nearbyInputExample } from "@test/modules/insights/schema/dto/examples/nearby-input.dto.example.ts";
import { nearbyProjectsExample } from "@test/modules/insights/schema/dto/examples/nearby-projects.dto.example.ts";
import { partyDetailExample } from "@test/modules/insights/schema/dto/examples/party-detail.dto.example.ts";
import { partyListExample } from "@test/modules/insights/schema/dto/examples/party-list.dto.example.ts";
import { placeBrowseExample } from "@test/modules/insights/schema/dto/examples/place-browse.dto.example.ts";
import { placeCivicExample } from "@test/modules/insights/schema/dto/examples/place-civic.dto.example.ts";
import { placeElectionsExample } from "@test/modules/insights/schema/dto/examples/place-elections.dto.example.ts";
import { placeStatisticsExample } from "@test/modules/insights/schema/dto/examples/place-statistics.dto.example.ts";
import { projectDetailExample } from "@test/modules/insights/schema/dto/examples/project-detail.dto.example.ts";
import { searchQueryExample } from "@test/modules/insights/schema/dto/examples/search-query.dto.example.ts";
import { searchResultsExample } from "@test/modules/insights/schema/dto/examples/search-results.dto.example.ts";
import { tenderInputExample } from "@test/modules/insights/schema/dto/examples/tender-input.dto.example.ts";
import { tenderListExample } from "@test/modules/insights/schema/dto/examples/tender-list.dto.example.ts";
import { treeInputExample } from "@test/modules/insights/schema/dto/examples/tree-input.dto.example.ts";

import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";
import { InsightsInsightsModule } from "#/modules/insights/features/insights/insights.module.ts";
import { InsightsInsightsService } from "#/modules/insights/features/insights/insights.service.ts";

/**
 * Managed by Dryv: the Insights HTTP surface behaves as its contract says. The
 * project implementation is replaced with mocks, so these specs check routing, input binding,
 * validation, status codes and response passthrough without business logic or a database.
 */

// Repositories resolve without a database; the mocked service never reaches them.
@Global()
@Module({
  providers: [
    {
      provide: getDataSourceToken(),
      useValue: {
        options: { type: "postgres" },
        entityMetadatas: [],
        getRepository: () => ({}),
      },
    },
  ],
  exports: [getDataSourceToken()],
})
class InMemoryDataSourceModule {}

const service = {
  browsePlaces: vi.fn(),
  getCompareOptions: vi.fn(),
  getComparison: vi.fn(),
  getContent: vi.fn(),
  getElection: vi.fn(),
  getGovernanceTabs: vi.fn(),
  getGovernanceTree: vi.fn(),
  getIndicatorMap: vi.fn(),
  getIndicatorSeries: vi.fn(),
  getInstitution: vi.fn(),
  getLeaderProfile: vi.fn(),
  getLeaderTree: vi.fn(),
  getLeaderboard: vi.fn(),
  getLegalBasis: vi.fn(),
  getMotion: vi.fn(),
  getNearbyProjects: vi.fn(),
  getParty: vi.fn(),
  getPlaceCivic: vi.fn(),
  getPlaceElections: vi.fn(),
  getPlaceStatistics: vi.fn(),
  getProject: vi.fn(),
  globalSearch: vi.fn(),
  listContent: vi.fn(),
  listElections: vi.fn(),
  listInstitutions: vi.fn(),
  listLeaderboardMetrics: vi.fn(),
  listMotions: vi.fn(),
  listParties: vi.fn(),
  listTenders: vi.fn(),
};

type Sent = {
  params: Record<string, unknown>;
  query: Record<string, unknown>;
  headers: Record<string, string>;
  body?: unknown;
};

let app: INestApplication;
let base: string;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [InMemoryDataSourceModule, InsightsInsightsModule],
  })
    .overrideProvider(InsightsInsightsService)
    .useValue(service)
    .compile();
  app = moduleRef.createNestApplication();
  app.useGlobalPipes(new HttpValidationPipe(httpOptions));
  await app.listen(0);
  base = (await app.getUrl()).replace("[::1]", "localhost");
});

afterAll(async () => {
  await app?.close();
});

beforeEach(() => {
  vi.clearAllMocks();
});

/** Scalar query parameters from an example; nested values stay out of the query string. */
function queryOf(value: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(value).filter(
      ([, item]) => item === null || typeof item !== "object" || Array.isArray(item),
    ),
  );
}

async function send(method: string, path: string, sent: Sent): Promise<Response> {
  const url = new URL(
    base +
      path.replace(/\{(\w+)\}/g, (_match, name: string) =>
        encodeURIComponent(String(sent.params[name])),
      ),
  );
  for (const [key, value] of Object.entries(sent.query)) {
    for (const item of Array.isArray(value) ? value : [value])
      url.searchParams.append(key, String(item));
  }
  return fetch(url, {
    method,
    headers: { "content-type": "application/json", ...sent.headers },
    body: sent.body === undefined ? undefined : JSON.stringify(sent.body),
  });
}

describe("GET /v1/browse (browsePlaces)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(browseInputExample.valid()) },
      headers: {},
    };
    const result = placeBrowseExample.valid();
    service.browsePlaces.mockResolvedValue(result);

    const response = await send("GET", "/v1/browse", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.browsePlaces).toHaveBeenCalledTimes(1);
    expect(service.browsePlaces).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/compare/options (getCompareOptions)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(compareOptionsInputExample.valid()) },
      headers: {},
    };
    const result = compareOptionsExample.valid();
    service.getCompareOptions.mockResolvedValue(result);

    const response = await send("GET", "/v1/compare/options", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getCompareOptions).toHaveBeenCalledTimes(1);
    expect(service.getCompareOptions).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/compare (getComparison)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(comparisonInputExample.valid()) },
      headers: {},
    };
    const result = comparisonExample.valid();
    service.getComparison.mockResolvedValue(result);

    const response = await send("GET", "/v1/compare", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getComparison).toHaveBeenCalledTimes(1);
    expect(service.getComparison).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/content (getContent)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(contentInputExample.valid()) },
      headers: {},
    };
    const result = contentPageExample.valid();
    service.getContent.mockResolvedValue(result);

    const response = await send("GET", "/v1/content", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getContent).toHaveBeenCalledTimes(1);
    expect(service.getContent).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/elections/{electionId} (getElection)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: { electionId: "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11" },
      query: {
        parentFeatureId: "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11",
        contestKind: "value",
      },
      headers: {},
    };
    const result = electionDetailExample.valid();
    service.getElection.mockResolvedValue(result);

    const response = await send("GET", "/v1/elections/{electionId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getElection).toHaveBeenCalledTimes(1);
    expect(service.getElection).toHaveBeenCalledWith(
      expect.objectContaining({
        electionId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"),
        parentFeatureId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"),
        contestKind: String("value"),
      }),
    );
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/governance/tabs (getGovernanceTabs)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: {},
      headers: {},
    };
    const result = governanceTabsExample.valid();
    service.getGovernanceTabs.mockResolvedValue(result);

    const response = await send("GET", "/v1/governance/tabs", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getGovernanceTabs).toHaveBeenCalledTimes(1);
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/governance/tree (getGovernanceTree)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(govTreeInputExample.valid()) },
      headers: {},
    };
    const result = governanceTreeExample.valid();
    service.getGovernanceTree.mockResolvedValue(result);

    const response = await send("GET", "/v1/governance/tree", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getGovernanceTree).toHaveBeenCalledTimes(1);
    expect(service.getGovernanceTree).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/statistics/indicators/{indicatorCode}/map (getIndicatorMap)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: { indicatorCode: "value" },
      query: {
        parentFeatureId: "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11",
        kindCode: "value",
      },
      headers: {},
    };
    const result = indicatorMapExample.valid();
    service.getIndicatorMap.mockResolvedValue(result);

    const response = await send("GET", "/v1/statistics/indicators/{indicatorCode}/map", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getIndicatorMap).toHaveBeenCalledTimes(1);
    expect(service.getIndicatorMap).toHaveBeenCalledWith(
      expect.objectContaining({
        indicatorCode: String("value"),
        parentFeatureId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"),
        kindCode: String("value"),
      }),
    );
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/statistics/indicators/{indicatorCode}/series (getIndicatorSeries)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: { indicatorCode: "value" },
      query: { featureId: "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11" },
      headers: {},
    };
    const result = indicatorSeriesExample.valid();
    service.getIndicatorSeries.mockResolvedValue(result);

    const response = await send("GET", "/v1/statistics/indicators/{indicatorCode}/series", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getIndicatorSeries).toHaveBeenCalledTimes(1);
    expect(service.getIndicatorSeries).toHaveBeenCalledWith(
      expect.objectContaining({
        indicatorCode: String("value"),
        featureId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"),
      }),
    );
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/institutions/{code} (getInstitution)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: { code: "value" },
      query: {},
      headers: {},
    };
    const result = institutionDetailExample.valid();
    service.getInstitution.mockResolvedValue(result);

    const response = await send("GET", "/v1/institutions/{code}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getInstitution).toHaveBeenCalledTimes(1);
    expect(service.getInstitution).toHaveBeenCalledWith(
      expect.objectContaining({ code: String("value") }),
    );
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/leaders/{id} (getLeaderProfile)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: { id: "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11" },
      query: {},
      headers: {},
    };
    const result = leaderProfileExample.valid();
    service.getLeaderProfile.mockResolvedValue(result);

    const response = await send("GET", "/v1/leaders/{id}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getLeaderProfile).toHaveBeenCalledTimes(1);
    expect(service.getLeaderProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        id: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"),
      }),
    );
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/leaders/tree (getLeaderTree)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(treeInputExample.valid()) },
      headers: {},
    };
    const result = leaderTreeExample.valid();
    service.getLeaderTree.mockResolvedValue(result);

    const response = await send("GET", "/v1/leaders/tree", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getLeaderTree).toHaveBeenCalledTimes(1);
    expect(service.getLeaderTree).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/leaderboards/{metricCode} (getLeaderboard)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: { metricCode: "value" },
      query: {
        kindCode: "value",
        parentFeatureId: "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11",
        limit: 1,
      },
      headers: {},
    };
    const result = leaderboardExample.valid();
    service.getLeaderboard.mockResolvedValue(result);

    const response = await send("GET", "/v1/leaderboards/{metricCode}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getLeaderboard).toHaveBeenCalledTimes(1);
    expect(service.getLeaderboard).toHaveBeenCalledWith(
      expect.objectContaining({
        metricCode: String("value"),
        kindCode: String("value"),
        parentFeatureId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"),
        limit: 1,
      }),
    );
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/legal-basis (getLegalBasis)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(legalBasisInputExample.valid()) },
      headers: {},
    };
    const result = legalBasisExample.valid();
    service.getLegalBasis.mockResolvedValue(result);

    const response = await send("GET", "/v1/legal-basis", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getLegalBasis).toHaveBeenCalledTimes(1);
    expect(service.getLegalBasis).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/motions/{code} (getMotion)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: { code: "value" },
      query: {},
      headers: {},
    };
    const result = motionDetailExample.valid();
    service.getMotion.mockResolvedValue(result);

    const response = await send("GET", "/v1/motions/{code}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getMotion).toHaveBeenCalledTimes(1);
    expect(service.getMotion).toHaveBeenCalledWith(
      expect.objectContaining({ code: String("value") }),
    );
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/projects/near (getNearbyProjects)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(nearbyInputExample.valid()) },
      headers: {},
    };
    const result = nearbyProjectsExample.valid();
    service.getNearbyProjects.mockResolvedValue(result);

    const response = await send("GET", "/v1/projects/near", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getNearbyProjects).toHaveBeenCalledTimes(1);
    expect(service.getNearbyProjects).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/parties/{code} (getParty)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: { code: "value" },
      query: {},
      headers: {},
    };
    const result = partyDetailExample.valid();
    service.getParty.mockResolvedValue(result);

    const response = await send("GET", "/v1/parties/{code}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getParty).toHaveBeenCalledTimes(1);
    expect(service.getParty).toHaveBeenCalledWith(
      expect.objectContaining({ code: String("value") }),
    );
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/civic/places/{featureId} (getPlaceCivic)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: { featureId: "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11" },
      query: {},
      headers: {},
    };
    const result = placeCivicExample.valid();
    service.getPlaceCivic.mockResolvedValue(result);

    const response = await send("GET", "/v1/civic/places/{featureId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getPlaceCivic).toHaveBeenCalledTimes(1);
    expect(service.getPlaceCivic).toHaveBeenCalledWith(
      expect.objectContaining({
        featureId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"),
      }),
    );
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/elections/places/{featureId} (getPlaceElections)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: { featureId: "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11" },
      query: {},
      headers: {},
    };
    const result = placeElectionsExample.valid();
    service.getPlaceElections.mockResolvedValue(result);

    const response = await send("GET", "/v1/elections/places/{featureId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getPlaceElections).toHaveBeenCalledTimes(1);
    expect(service.getPlaceElections).toHaveBeenCalledWith(
      expect.objectContaining({
        featureId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"),
      }),
    );
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/statistics/places/{featureId} (getPlaceStatistics)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: { featureId: "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11" },
      query: {},
      headers: {},
    };
    const result = placeStatisticsExample.valid();
    service.getPlaceStatistics.mockResolvedValue(result);

    const response = await send("GET", "/v1/statistics/places/{featureId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getPlaceStatistics).toHaveBeenCalledTimes(1);
    expect(service.getPlaceStatistics).toHaveBeenCalledWith(
      expect.objectContaining({
        featureId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"),
      }),
    );
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/projects/{code} (getProject)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: { code: "value" },
      query: {},
      headers: {},
    };
    const result = projectDetailExample.valid();
    service.getProject.mockResolvedValue(result);

    const response = await send("GET", "/v1/projects/{code}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getProject).toHaveBeenCalledTimes(1);
    expect(service.getProject).toHaveBeenCalledWith(
      expect.objectContaining({ code: String("value") }),
    );
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/search (globalSearch)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(searchQueryExample.valid()) },
      headers: {},
    };
    const result = searchResultsExample.valid();
    service.globalSearch.mockResolvedValue(result);

    const response = await send("GET", "/v1/search", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.globalSearch).toHaveBeenCalledTimes(1);
    expect(service.globalSearch).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/content/list (listContent)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(contentListInputExample.valid()) },
      headers: {},
    };
    const result = contentListExample.valid();
    service.listContent.mockResolvedValue(result);

    const response = await send("GET", "/v1/content/list", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.listContent).toHaveBeenCalledTimes(1);
    expect(service.listContent).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/elections (listElections)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: {},
      headers: {},
    };
    const result = electionListExample.valid();
    service.listElections.mockResolvedValue(result);

    const response = await send("GET", "/v1/elections", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.listElections).toHaveBeenCalledTimes(1);
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/institutions (listInstitutions)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(institutionsInputExample.valid()) },
      headers: {},
    };
    const result = institutionListExample.valid();
    service.listInstitutions.mockResolvedValue(result);

    const response = await send("GET", "/v1/institutions", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.listInstitutions).toHaveBeenCalledTimes(1);
    expect(service.listInstitutions).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/leaderboards (listLeaderboardMetrics)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: {},
      headers: {},
    };
    const result = leaderboardMetricListExample.valid();
    service.listLeaderboardMetrics.mockResolvedValue(result);

    const response = await send("GET", "/v1/leaderboards", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.listLeaderboardMetrics).toHaveBeenCalledTimes(1);
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/motions (listMotions)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(motionsInputExample.valid()) },
      headers: {},
    };
    const result = motionListExample.valid();
    service.listMotions.mockResolvedValue(result);

    const response = await send("GET", "/v1/motions", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.listMotions).toHaveBeenCalledTimes(1);
    expect(service.listMotions).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/parties (listParties)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: {},
      headers: {},
    };
    const result = partyListExample.valid();
    service.listParties.mockResolvedValue(result);

    const response = await send("GET", "/v1/parties", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.listParties).toHaveBeenCalledTimes(1);
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/tenders (listTenders)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(tenderInputExample.valid()) },
      headers: {},
    };
    const result = tenderListExample.valid();
    service.listTenders.mockResolvedValue(result);

    const response = await send("GET", "/v1/tenders", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.listTenders).toHaveBeenCalledTimes(1);
    expect(service.listTenders).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});
