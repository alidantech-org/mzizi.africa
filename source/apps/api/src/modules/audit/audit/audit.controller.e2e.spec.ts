import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { commentListQueryExample } from "#/modules/audit/dto/comment-list-query.dto.example.ts";
import { commentResponseExample } from "#/modules/audit/dto/comment-response.dto.example.ts";
import { commentsListResponseExample } from "#/modules/audit/dto/comments-list-response.dto.example.ts";
import { createCommentBodyExample } from "#/modules/audit/dto/create-comment-body.dto.example.ts";
import { createEvidenceReferenceBodyExample } from "#/modules/audit/dto/create-evidence-reference-body.dto.example.ts";
import { createReviewDecisionBodyExample } from "#/modules/audit/dto/create-review-decision-body.dto.example.ts";
import { evidenceReferenceListQueryExample } from "#/modules/audit/dto/evidence-reference-list-query.dto.example.ts";
import { evidenceReferenceResponseExample } from "#/modules/audit/dto/evidence-reference-response.dto.example.ts";
import { evidenceReferencesListResponseExample } from "#/modules/audit/dto/evidence-references-list-response.dto.example.ts";
import { reviewDecisionListQueryExample } from "#/modules/audit/dto/review-decision-list-query.dto.example.ts";
import { reviewDecisionResponseExample } from "#/modules/audit/dto/review-decision-response.dto.example.ts";
import { reviewDecisionsListResponseExample } from "#/modules/audit/dto/review-decisions-list-response.dto.example.ts";

import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";
import { AuditAuditModule } from "#/modules/audit/audit/audit.module.ts";
import { AuditAuditService } from "#/modules/audit/audit/audit.service.ts";

/**
 * Managed by Dryv: the Audit HTTP surface behaves as its contract says. The
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
  createComment: vi.fn(),
  createEvidenceReference: vi.fn(),
  createReviewDecision: vi.fn(),
  findComments: vi.fn(),
  findEvidenceReferences: vi.fn(),
  findReviewDecisions: vi.fn(),
  getCommentById: vi.fn(),
  getEvidenceReferenceById: vi.fn(),
  getReviewDecisionById: vi.fn(),
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
    imports: [InMemoryDataSourceModule, AuditAuditModule],
  })
    .overrideProvider(AuditAuditService)
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

describe("POST /v1/audit/comments (createComment)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { },
        headers: { },
        body: createCommentBodyExample.valid(),
      };
    const result = commentResponseExample.valid();
    service.createComment.mockResolvedValue(result);

    const response = await send("POST", "/v1/audit/comments", sent);

    expect(response.status, await response.clone().text()).toBe(201);
    expect(service.createComment).toHaveBeenCalledTimes(1);
    expect(service.createComment).toHaveBeenCalledWith(expect.objectContaining(sent.body));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });

  it("rejects an invalid body without calling the service", async () => {
    const [violation] = createCommentBodyExample.violations();
    if (violation === undefined) return;
    const sent: Sent = { ...{
        params: { },
        query: { },
        headers: { },
        body: createCommentBodyExample.valid(),
      }, body: violation.value };

    const response = await send("POST", "/v1/audit/comments", sent);

    expect(response.status).toBe(400);
    expect(service.createComment).not.toHaveBeenCalled();
  });
});

describe("POST /v1/audit/evidence (createEvidenceReference)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { },
        headers: { },
        body: createEvidenceReferenceBodyExample.valid(),
      };
    const result = evidenceReferenceResponseExample.valid();
    service.createEvidenceReference.mockResolvedValue(result);

    const response = await send("POST", "/v1/audit/evidence", sent);

    expect(response.status, await response.clone().text()).toBe(201);
    expect(service.createEvidenceReference).toHaveBeenCalledTimes(1);
    expect(service.createEvidenceReference).toHaveBeenCalledWith(expect.objectContaining(sent.body));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });

  it("rejects an invalid body without calling the service", async () => {
    const [violation] = createEvidenceReferenceBodyExample.violations();
    if (violation === undefined) return;
    const sent: Sent = { ...{
        params: { },
        query: { },
        headers: { },
        body: createEvidenceReferenceBodyExample.valid(),
      }, body: violation.value };

    const response = await send("POST", "/v1/audit/evidence", sent);

    expect(response.status).toBe(400);
    expect(service.createEvidenceReference).not.toHaveBeenCalled();
  });
});

describe("POST /v1/audit/decisions (createReviewDecision)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { },
        headers: { },
        body: createReviewDecisionBodyExample.valid(),
      };
    const result = reviewDecisionResponseExample.valid();
    service.createReviewDecision.mockResolvedValue(result);

    const response = await send("POST", "/v1/audit/decisions", sent);

    expect(response.status, await response.clone().text()).toBe(201);
    expect(service.createReviewDecision).toHaveBeenCalledTimes(1);
    expect(service.createReviewDecision).toHaveBeenCalledWith(expect.objectContaining(sent.body));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });

  it("rejects an invalid body without calling the service", async () => {
    const [violation] = createReviewDecisionBodyExample.violations();
    if (violation === undefined) return;
    const sent: Sent = { ...{
        params: { },
        query: { },
        headers: { },
        body: createReviewDecisionBodyExample.valid(),
      }, body: violation.value };

    const response = await send("POST", "/v1/audit/decisions", sent);

    expect(response.status).toBe(400);
    expect(service.createReviewDecision).not.toHaveBeenCalled();
  });
});

describe("GET /v1/audit/comments (findComments)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(commentListQueryExample.valid()), },
        headers: { },
      };
    const result = commentsListResponseExample.valid();
    service.findComments.mockResolvedValue(result);

    const response = await send("GET", "/v1/audit/comments", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findComments).toHaveBeenCalledTimes(1);
    expect(service.findComments).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/audit/evidence (findEvidenceReferences)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(evidenceReferenceListQueryExample.valid()), },
        headers: { },
      };
    const result = evidenceReferencesListResponseExample.valid();
    service.findEvidenceReferences.mockResolvedValue(result);

    const response = await send("GET", "/v1/audit/evidence", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findEvidenceReferences).toHaveBeenCalledTimes(1);
    expect(service.findEvidenceReferences).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/audit/decisions (findReviewDecisions)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(reviewDecisionListQueryExample.valid()), },
        headers: { },
      };
    const result = reviewDecisionsListResponseExample.valid();
    service.findReviewDecisions.mockResolvedValue(result);

    const response = await send("GET", "/v1/audit/decisions", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findReviewDecisions).toHaveBeenCalledTimes(1);
    expect(service.findReviewDecisions).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/audit/comments/{commentId} (getCommentById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "commentId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = commentResponseExample.valid();
    service.getCommentById.mockResolvedValue(result);

    const response = await send("GET", "/v1/audit/comments/{commentId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getCommentById).toHaveBeenCalledTimes(1);
    expect(service.getCommentById).toHaveBeenCalledWith(expect.objectContaining({ commentId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/audit/evidence/{evidenceId} (getEvidenceReferenceById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "evidenceId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = evidenceReferenceResponseExample.valid();
    service.getEvidenceReferenceById.mockResolvedValue(result);

    const response = await send("GET", "/v1/audit/evidence/{evidenceId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getEvidenceReferenceById).toHaveBeenCalledTimes(1);
    expect(service.getEvidenceReferenceById).toHaveBeenCalledWith(expect.objectContaining({ evidenceId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/audit/decisions/{decisionId} (getReviewDecisionById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "decisionId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = reviewDecisionResponseExample.valid();
    service.getReviewDecisionById.mockResolvedValue(result);

    const response = await send("GET", "/v1/audit/decisions/{decisionId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getReviewDecisionById).toHaveBeenCalledTimes(1);
    expect(service.getReviewDecisionById).toHaveBeenCalledWith(expect.objectContaining({ decisionId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});