import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { loanDisbursementListQueryExample } from "#/modules/debt/dto/loan-disbursement-list-query.dto.example.ts";
import { loanDisbursementResponseExample } from "#/modules/debt/dto/loan-disbursement-response.dto.example.ts";
import { loanDisbursementsListResponseExample } from "#/modules/debt/dto/loan-disbursements-list-response.dto.example.ts";
import { loanListQueryExample } from "#/modules/debt/dto/loan-list-query.dto.example.ts";
import { loanRepaymentListQueryExample } from "#/modules/debt/dto/loan-repayment-list-query.dto.example.ts";
import { loanRepaymentResponseExample } from "#/modules/debt/dto/loan-repayment-response.dto.example.ts";
import { loanRepaymentsListResponseExample } from "#/modules/debt/dto/loan-repayments-list-response.dto.example.ts";
import { loanResponseExample } from "#/modules/debt/dto/loan-response.dto.example.ts";
import { loansListResponseExample } from "#/modules/debt/dto/loans-list-response.dto.example.ts";

import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";
import { DebtDebtReadModule } from "#/modules/debt/debt-read/debt-read.module.ts";
import { DebtDebtReadService } from "#/modules/debt/debt-read/debt-read.service.ts";

/**
 * Managed by Dryv: the Debt Read HTTP surface behaves as its contract says. The
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
  findLoanDisbursements: vi.fn(),
  findLoanRepayments: vi.fn(),
  findLoans: vi.fn(),
  getLoanById: vi.fn(),
  getLoanDisbursementById: vi.fn(),
  getLoanRepaymentById: vi.fn(),
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
    imports: [InMemoryDataSourceModule, DebtDebtReadModule],
  })
    .overrideProvider(DebtDebtReadService)
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

describe("GET /v1/debt/disbursements (findLoanDisbursements)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(loanDisbursementListQueryExample.valid()), },
        headers: { },
      };
    const result = loanDisbursementsListResponseExample.valid();
    service.findLoanDisbursements.mockResolvedValue(result);

    const response = await send("GET", "/v1/debt/disbursements", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findLoanDisbursements).toHaveBeenCalledTimes(1);
    expect(service.findLoanDisbursements).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/debt/repayments (findLoanRepayments)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(loanRepaymentListQueryExample.valid()), },
        headers: { },
      };
    const result = loanRepaymentsListResponseExample.valid();
    service.findLoanRepayments.mockResolvedValue(result);

    const response = await send("GET", "/v1/debt/repayments", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findLoanRepayments).toHaveBeenCalledTimes(1);
    expect(service.findLoanRepayments).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/debt/loans (findLoans)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(loanListQueryExample.valid()), },
        headers: { },
      };
    const result = loansListResponseExample.valid();
    service.findLoans.mockResolvedValue(result);

    const response = await send("GET", "/v1/debt/loans", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findLoans).toHaveBeenCalledTimes(1);
    expect(service.findLoans).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/debt/loans/{loanId} (getLoanById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "loanId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = loanResponseExample.valid();
    service.getLoanById.mockResolvedValue(result);

    const response = await send("GET", "/v1/debt/loans/{loanId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getLoanById).toHaveBeenCalledTimes(1);
    expect(service.getLoanById).toHaveBeenCalledWith(expect.objectContaining({ loanId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/debt/disbursements/{disbursementId} (getLoanDisbursementById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "disbursementId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = loanDisbursementResponseExample.valid();
    service.getLoanDisbursementById.mockResolvedValue(result);

    const response = await send("GET", "/v1/debt/disbursements/{disbursementId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getLoanDisbursementById).toHaveBeenCalledTimes(1);
    expect(service.getLoanDisbursementById).toHaveBeenCalledWith(expect.objectContaining({ disbursementId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/debt/repayments/{repaymentId} (getLoanRepaymentById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "repaymentId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = loanRepaymentResponseExample.valid();
    service.getLoanRepaymentById.mockResolvedValue(result);

    const response = await send("GET", "/v1/debt/repayments/{repaymentId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getLoanRepaymentById).toHaveBeenCalledTimes(1);
    expect(service.getLoanRepaymentById).toHaveBeenCalledWith(expect.objectContaining({ repaymentId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});