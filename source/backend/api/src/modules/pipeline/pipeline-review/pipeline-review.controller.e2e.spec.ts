import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { applyReviewsQueryExample } from "#/modules/pipeline/dto/apply-reviews-query.dto.example.ts";
import { applyReviewsResponseExample } from "#/modules/pipeline/dto/apply-reviews-response.dto.example.ts";
import { assessmentDecisionResponseExample } from "#/modules/pipeline/dto/assessment-decision-response.dto.example.ts";
import { assessmentListResponseExample } from "#/modules/pipeline/dto/assessment-list-response.dto.example.ts";
import { candidateDetailResponseExample } from "#/modules/pipeline/dto/candidate-detail-response.dto.example.ts";
import { candidateListQueryExample } from "#/modules/pipeline/dto/candidate-list-query.dto.example.ts";
import { candidateListResponseExample } from "#/modules/pipeline/dto/candidate-list-response.dto.example.ts";
import { dossierListResponseExample } from "#/modules/pipeline/dto/dossier-list-response.dto.example.ts";
import { jobListResponseExample } from "#/modules/pipeline/dto/job-list-response.dto.example.ts";
import { pageQueryExample } from "#/modules/pipeline/dto/page-query.dto.example.ts";
import { promoteResponseExample } from "#/modules/pipeline/dto/promote-response.dto.example.ts";
import { runListResponseExample } from "#/modules/pipeline/dto/run-list-response.dto.example.ts";
import { siteListResponseExample } from "#/modules/pipeline/dto/site-list-response.dto.example.ts";

import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";
import { PipelinePipelineReviewModule } from "#/modules/pipeline/pipeline-review/pipeline-review.module.ts";
import { PipelinePipelineReviewService } from "#/modules/pipeline/pipeline-review/pipeline-review.service.ts";

/**
 * Managed by Dryv: the Pipeline Review HTTP surface behaves as its contract says. The
 * project implementation is replaced with mocks, so these specs check routing, input binding,
 * validation, status codes and response passthrough without business logic or a database.
 */

// Repositories resolve without a database; the mocked service never reaches them.
@Global()
@Module({
  providers: [
    {
      provide: getDataSourceToken(),
      useValue: { options: { type: "postgres" }, entityMetadatas: [], getRepository: () => ({}) },
    },
  ],
  exports: [getDataSourceToken()],
})
class InMemoryDataSourceModule {}

const service = {
  applyReviewDecisions: vi.fn(),
  approveAssessment: vi.fn(),
  findAssessments: vi.fn(),
  findCandidates: vi.fn(),
  findDossiers: vi.fn(),
  findJobs: vi.fn(),
  findRuns: vi.fn(),
  findSites: vi.fn(),
  getCandidateDetail: vi.fn(),
  promoteCandidate: vi.fn(),
  rejectAssessment: vi.fn(),
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
    imports: [InMemoryDataSourceModule, PipelinePipelineReviewModule],
  })
    .overrideProvider(PipelinePipelineReviewService)
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
    Object.entries(value).filter(([, item]) => item === null || typeof item !== "object" || Array.isArray(item)),
  );
}

async function send(method: string, path: string, sent: Sent): Promise<Response> {
  const url = new URL(
    base + path.replace(/\{(\w+)\}/g, (_match, name: string) => encodeURIComponent(String(sent.params[name]))),
  );
  for (const [key, value] of Object.entries(sent.query)) {
    for (const item of Array.isArray(value) ? value : [value]) url.searchParams.append(key, String(item));
  }
  return fetch(url, {
    method,
    headers: { "content-type": "application/json", ...sent.headers },
    body: sent.body === undefined ? undefined : JSON.stringify(sent.body),
  });
}

describe("POST /v1/pipeline/reviews/apply (applyReviewDecisions)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(applyReviewsQueryExample.valid()), },
        headers: { },
      };
    const result = applyReviewsResponseExample.valid();
    service.applyReviewDecisions.mockResolvedValue(result);

    const response = await send("POST", "/v1/pipeline/reviews/apply", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.applyReviewDecisions).toHaveBeenCalledTimes(1);
    expect(service.applyReviewDecisions).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("POST /v1/pipeline/assessments/{assessmentId}/approve (approveAssessment)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "assessmentId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = assessmentDecisionResponseExample.valid();
    service.approveAssessment.mockResolvedValue(result);

    const response = await send("POST", "/v1/pipeline/assessments/{assessmentId}/approve", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.approveAssessment).toHaveBeenCalledTimes(1);
    expect(service.approveAssessment).toHaveBeenCalledWith(expect.objectContaining({ assessmentId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/pipeline/assessments (findAssessments)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(pageQueryExample.valid()), },
        headers: { },
      };
    const result = assessmentListResponseExample.valid();
    service.findAssessments.mockResolvedValue(result);

    const response = await send("GET", "/v1/pipeline/assessments", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findAssessments).toHaveBeenCalledTimes(1);
    expect(service.findAssessments).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/pipeline/candidates (findCandidates)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(candidateListQueryExample.valid()), },
        headers: { },
      };
    const result = candidateListResponseExample.valid();
    service.findCandidates.mockResolvedValue(result);

    const response = await send("GET", "/v1/pipeline/candidates", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findCandidates).toHaveBeenCalledTimes(1);
    expect(service.findCandidates).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/pipeline/dossiers (findDossiers)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(pageQueryExample.valid()), },
        headers: { },
      };
    const result = dossierListResponseExample.valid();
    service.findDossiers.mockResolvedValue(result);

    const response = await send("GET", "/v1/pipeline/dossiers", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findDossiers).toHaveBeenCalledTimes(1);
    expect(service.findDossiers).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/pipeline/jobs (findJobs)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(pageQueryExample.valid()), },
        headers: { },
      };
    const result = jobListResponseExample.valid();
    service.findJobs.mockResolvedValue(result);

    const response = await send("GET", "/v1/pipeline/jobs", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findJobs).toHaveBeenCalledTimes(1);
    expect(service.findJobs).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/pipeline/runs (findRuns)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(pageQueryExample.valid()), },
        headers: { },
      };
    const result = runListResponseExample.valid();
    service.findRuns.mockResolvedValue(result);

    const response = await send("GET", "/v1/pipeline/runs", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findRuns).toHaveBeenCalledTimes(1);
    expect(service.findRuns).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/pipeline/sites (findSites)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(pageQueryExample.valid()), },
        headers: { },
      };
    const result = siteListResponseExample.valid();
    service.findSites.mockResolvedValue(result);

    const response = await send("GET", "/v1/pipeline/sites", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findSites).toHaveBeenCalledTimes(1);
    expect(service.findSites).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/pipeline/candidates/{candidateId} (getCandidateDetail)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "candidateId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = candidateDetailResponseExample.valid();
    service.getCandidateDetail.mockResolvedValue(result);

    const response = await send("GET", "/v1/pipeline/candidates/{candidateId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getCandidateDetail).toHaveBeenCalledTimes(1);
    expect(service.getCandidateDetail).toHaveBeenCalledWith(expect.objectContaining({ candidateId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("POST /v1/pipeline/candidates/{candidateId}/promote (promoteCandidate)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "candidateId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = promoteResponseExample.valid();
    service.promoteCandidate.mockResolvedValue(result);

    const response = await send("POST", "/v1/pipeline/candidates/{candidateId}/promote", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.promoteCandidate).toHaveBeenCalledTimes(1);
    expect(service.promoteCandidate).toHaveBeenCalledWith(expect.objectContaining({ candidateId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("POST /v1/pipeline/assessments/{assessmentId}/reject (rejectAssessment)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "assessmentId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = assessmentDecisionResponseExample.valid();
    service.rejectAssessment.mockResolvedValue(result);

    const response = await send("POST", "/v1/pipeline/assessments/{assessmentId}/reject", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.rejectAssessment).toHaveBeenCalledTimes(1);
    expect(service.rejectAssessment).toHaveBeenCalledWith(expect.objectContaining({ assessmentId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});