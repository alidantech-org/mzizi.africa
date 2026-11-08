import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { candidateListQueryExample } from "#/modules/elections/dto/candidate-list-query.dto.example.ts";
import { candidateResponseExample } from "#/modules/elections/dto/candidate-response.dto.example.ts";
import { candidatesListResponseExample } from "#/modules/elections/dto/candidates-list-response.dto.example.ts";
import { electionListQueryExample } from "#/modules/elections/dto/election-list-query.dto.example.ts";
import { electionResponseExample } from "#/modules/elections/dto/election-response.dto.example.ts";
import { electionResultListQueryExample } from "#/modules/elections/dto/election-result-list-query.dto.example.ts";
import { electionResultResponseExample } from "#/modules/elections/dto/election-result-response.dto.example.ts";
import { electionResultsListResponseExample } from "#/modules/elections/dto/election-results-list-response.dto.example.ts";
import { electionsListResponseExample } from "#/modules/elections/dto/elections-list-response.dto.example.ts";
import { electorateListQueryExample } from "#/modules/elections/dto/electorate-list-query.dto.example.ts";
import { electorateResponseExample } from "#/modules/elections/dto/electorate-response.dto.example.ts";
import { electoratesListResponseExample } from "#/modules/elections/dto/electorates-list-response.dto.example.ts";
import { manifestoCommitmentListQueryExample } from "#/modules/elections/dto/manifesto-commitment-list-query.dto.example.ts";
import { manifestoCommitmentResponseExample } from "#/modules/elections/dto/manifesto-commitment-response.dto.example.ts";
import { manifestoCommitmentsListResponseExample } from "#/modules/elections/dto/manifesto-commitments-list-response.dto.example.ts";
import { manifestoListQueryExample } from "#/modules/elections/dto/manifesto-list-query.dto.example.ts";
import { manifestoResponseExample } from "#/modules/elections/dto/manifesto-response.dto.example.ts";
import { manifestosListResponseExample } from "#/modules/elections/dto/manifestos-list-response.dto.example.ts";
import { referendumOptionListQueryExample } from "#/modules/elections/dto/referendum-option-list-query.dto.example.ts";
import { referendumOptionResponseExample } from "#/modules/elections/dto/referendum-option-response.dto.example.ts";
import { referendumOptionsListResponseExample } from "#/modules/elections/dto/referendum-options-list-response.dto.example.ts";
import { referendumQuestionListQueryExample } from "#/modules/elections/dto/referendum-question-list-query.dto.example.ts";
import { referendumQuestionResponseExample } from "#/modules/elections/dto/referendum-question-response.dto.example.ts";
import { referendumQuestionsListResponseExample } from "#/modules/elections/dto/referendum-questions-list-response.dto.example.ts";
import { referendumResultListQueryExample } from "#/modules/elections/dto/referendum-result-list-query.dto.example.ts";
import { referendumResultResponseExample } from "#/modules/elections/dto/referendum-result-response.dto.example.ts";
import { referendumResultsListResponseExample } from "#/modules/elections/dto/referendum-results-list-response.dto.example.ts";
import { seatAllocationListQueryExample } from "#/modules/elections/dto/seat-allocation-list-query.dto.example.ts";
import { seatAllocationResponseExample } from "#/modules/elections/dto/seat-allocation-response.dto.example.ts";
import { seatAllocationsListResponseExample } from "#/modules/elections/dto/seat-allocations-list-response.dto.example.ts";
import { seatListQueryExample } from "#/modules/elections/dto/seat-list-query.dto.example.ts";
import { seatResponseExample } from "#/modules/elections/dto/seat-response.dto.example.ts";
import { seatsListResponseExample } from "#/modules/elections/dto/seats-list-response.dto.example.ts";

import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";
import { ElectionsElectionsReadModule } from "#/modules/elections/elections-read/elections-read.module.ts";
import { ElectionsElectionsReadService } from "#/modules/elections/elections-read/elections-read.service.ts";

/**
 * Managed by Dryv: the Elections Read HTTP surface behaves as its contract says. The
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
  findCandidates: vi.fn(),
  findElectionResults: vi.fn(),
  findElections: vi.fn(),
  findElectorates: vi.fn(),
  findManifestoCommitments: vi.fn(),
  findManifestos: vi.fn(),
  findReferendumOptions: vi.fn(),
  findReferendumQuestions: vi.fn(),
  findReferendumResults: vi.fn(),
  findSeatAllocations: vi.fn(),
  findSeats: vi.fn(),
  getCandidateById: vi.fn(),
  getElectionById: vi.fn(),
  getElectionResultById: vi.fn(),
  getElectorateById: vi.fn(),
  getManifestoById: vi.fn(),
  getManifestoCommitmentById: vi.fn(),
  getReferendumOptionById: vi.fn(),
  getReferendumQuestionById: vi.fn(),
  getReferendumResultById: vi.fn(),
  getSeatAllocationById: vi.fn(),
  getSeatById: vi.fn(),
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
    imports: [InMemoryDataSourceModule, ElectionsElectionsReadModule],
  })
    .overrideProvider(ElectionsElectionsReadService)
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

describe("GET /v1/elections/candidates (findCandidates)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(candidateListQueryExample.valid()), },
        headers: { },
      };
    const result = candidatesListResponseExample.valid();
    service.findCandidates.mockResolvedValue(result);

    const response = await send("GET", "/v1/elections/candidates", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findCandidates).toHaveBeenCalledTimes(1);
    expect(service.findCandidates).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/elections/results (findElectionResults)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(electionResultListQueryExample.valid()), },
        headers: { },
      };
    const result = electionResultsListResponseExample.valid();
    service.findElectionResults.mockResolvedValue(result);

    const response = await send("GET", "/v1/elections/results", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findElectionResults).toHaveBeenCalledTimes(1);
    expect(service.findElectionResults).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/elections/elections (findElections)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(electionListQueryExample.valid()), },
        headers: { },
      };
    const result = electionsListResponseExample.valid();
    service.findElections.mockResolvedValue(result);

    const response = await send("GET", "/v1/elections/elections", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findElections).toHaveBeenCalledTimes(1);
    expect(service.findElections).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/elections/electorates (findElectorates)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(electorateListQueryExample.valid()), },
        headers: { },
      };
    const result = electoratesListResponseExample.valid();
    service.findElectorates.mockResolvedValue(result);

    const response = await send("GET", "/v1/elections/electorates", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findElectorates).toHaveBeenCalledTimes(1);
    expect(service.findElectorates).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/elections/manifesto-commitments (findManifestoCommitments)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(manifestoCommitmentListQueryExample.valid()), },
        headers: { },
      };
    const result = manifestoCommitmentsListResponseExample.valid();
    service.findManifestoCommitments.mockResolvedValue(result);

    const response = await send("GET", "/v1/elections/manifesto-commitments", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findManifestoCommitments).toHaveBeenCalledTimes(1);
    expect(service.findManifestoCommitments).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/elections/manifestos (findManifestos)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(manifestoListQueryExample.valid()), },
        headers: { },
      };
    const result = manifestosListResponseExample.valid();
    service.findManifestos.mockResolvedValue(result);

    const response = await send("GET", "/v1/elections/manifestos", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findManifestos).toHaveBeenCalledTimes(1);
    expect(service.findManifestos).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/elections/referendum-options (findReferendumOptions)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(referendumOptionListQueryExample.valid()), },
        headers: { },
      };
    const result = referendumOptionsListResponseExample.valid();
    service.findReferendumOptions.mockResolvedValue(result);

    const response = await send("GET", "/v1/elections/referendum-options", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findReferendumOptions).toHaveBeenCalledTimes(1);
    expect(service.findReferendumOptions).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/elections/referendum-questions (findReferendumQuestions)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(referendumQuestionListQueryExample.valid()), },
        headers: { },
      };
    const result = referendumQuestionsListResponseExample.valid();
    service.findReferendumQuestions.mockResolvedValue(result);

    const response = await send("GET", "/v1/elections/referendum-questions", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findReferendumQuestions).toHaveBeenCalledTimes(1);
    expect(service.findReferendumQuestions).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/elections/referendum-results (findReferendumResults)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(referendumResultListQueryExample.valid()), },
        headers: { },
      };
    const result = referendumResultsListResponseExample.valid();
    service.findReferendumResults.mockResolvedValue(result);

    const response = await send("GET", "/v1/elections/referendum-results", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findReferendumResults).toHaveBeenCalledTimes(1);
    expect(service.findReferendumResults).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/elections/seat-allocations (findSeatAllocations)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(seatAllocationListQueryExample.valid()), },
        headers: { },
      };
    const result = seatAllocationsListResponseExample.valid();
    service.findSeatAllocations.mockResolvedValue(result);

    const response = await send("GET", "/v1/elections/seat-allocations", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findSeatAllocations).toHaveBeenCalledTimes(1);
    expect(service.findSeatAllocations).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/elections/seats (findSeats)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(seatListQueryExample.valid()), },
        headers: { },
      };
    const result = seatsListResponseExample.valid();
    service.findSeats.mockResolvedValue(result);

    const response = await send("GET", "/v1/elections/seats", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findSeats).toHaveBeenCalledTimes(1);
    expect(service.findSeats).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/elections/candidates/{candidateId} (getCandidateById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "candidateId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = candidateResponseExample.valid();
    service.getCandidateById.mockResolvedValue(result);

    const response = await send("GET", "/v1/elections/candidates/{candidateId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getCandidateById).toHaveBeenCalledTimes(1);
    expect(service.getCandidateById).toHaveBeenCalledWith(expect.objectContaining({ candidateId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/elections/elections/{electionId} (getElectionById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "electionId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = electionResponseExample.valid();
    service.getElectionById.mockResolvedValue(result);

    const response = await send("GET", "/v1/elections/elections/{electionId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getElectionById).toHaveBeenCalledTimes(1);
    expect(service.getElectionById).toHaveBeenCalledWith(expect.objectContaining({ electionId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/elections/results/{resultId} (getElectionResultById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "resultId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = electionResultResponseExample.valid();
    service.getElectionResultById.mockResolvedValue(result);

    const response = await send("GET", "/v1/elections/results/{resultId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getElectionResultById).toHaveBeenCalledTimes(1);
    expect(service.getElectionResultById).toHaveBeenCalledWith(expect.objectContaining({ resultId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/elections/electorates/{electorateId} (getElectorateById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "electorateId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = electorateResponseExample.valid();
    service.getElectorateById.mockResolvedValue(result);

    const response = await send("GET", "/v1/elections/electorates/{electorateId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getElectorateById).toHaveBeenCalledTimes(1);
    expect(service.getElectorateById).toHaveBeenCalledWith(expect.objectContaining({ electorateId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/elections/manifestos/{manifestoId} (getManifestoById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "manifestoId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = manifestoResponseExample.valid();
    service.getManifestoById.mockResolvedValue(result);

    const response = await send("GET", "/v1/elections/manifestos/{manifestoId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getManifestoById).toHaveBeenCalledTimes(1);
    expect(service.getManifestoById).toHaveBeenCalledWith(expect.objectContaining({ manifestoId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/elections/manifesto-commitments/{commitmentId} (getManifestoCommitmentById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "commitmentId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = manifestoCommitmentResponseExample.valid();
    service.getManifestoCommitmentById.mockResolvedValue(result);

    const response = await send("GET", "/v1/elections/manifesto-commitments/{commitmentId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getManifestoCommitmentById).toHaveBeenCalledTimes(1);
    expect(service.getManifestoCommitmentById).toHaveBeenCalledWith(expect.objectContaining({ commitmentId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/elections/referendum-options/{optionId} (getReferendumOptionById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "optionId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = referendumOptionResponseExample.valid();
    service.getReferendumOptionById.mockResolvedValue(result);

    const response = await send("GET", "/v1/elections/referendum-options/{optionId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getReferendumOptionById).toHaveBeenCalledTimes(1);
    expect(service.getReferendumOptionById).toHaveBeenCalledWith(expect.objectContaining({ optionId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/elections/referendum-questions/{questionId} (getReferendumQuestionById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "questionId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = referendumQuestionResponseExample.valid();
    service.getReferendumQuestionById.mockResolvedValue(result);

    const response = await send("GET", "/v1/elections/referendum-questions/{questionId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getReferendumQuestionById).toHaveBeenCalledTimes(1);
    expect(service.getReferendumQuestionById).toHaveBeenCalledWith(expect.objectContaining({ questionId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/elections/referendum-results/{referendumResultId} (getReferendumResultById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "referendumResultId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = referendumResultResponseExample.valid();
    service.getReferendumResultById.mockResolvedValue(result);

    const response = await send("GET", "/v1/elections/referendum-results/{referendumResultId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getReferendumResultById).toHaveBeenCalledTimes(1);
    expect(service.getReferendumResultById).toHaveBeenCalledWith(expect.objectContaining({ referendumResultId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/elections/seat-allocations/{allocationId} (getSeatAllocationById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "allocationId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = seatAllocationResponseExample.valid();
    service.getSeatAllocationById.mockResolvedValue(result);

    const response = await send("GET", "/v1/elections/seat-allocations/{allocationId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getSeatAllocationById).toHaveBeenCalledTimes(1);
    expect(service.getSeatAllocationById).toHaveBeenCalledWith(expect.objectContaining({ allocationId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/elections/seats/{seatId} (getSeatById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "seatId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = seatResponseExample.valid();
    service.getSeatById.mockResolvedValue(result);

    const response = await send("GET", "/v1/elections/seats/{seatId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getSeatById).toHaveBeenCalledTimes(1);
    expect(service.getSeatById).toHaveBeenCalledWith(expect.objectContaining({ seatId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});