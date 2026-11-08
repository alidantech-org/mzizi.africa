import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { budgetListQueryExample } from "#/modules/finance/dto/budget-list-query.dto.example.ts";
import { budgetResponseExample } from "#/modules/finance/dto/budget-response.dto.example.ts";
import { budgetaryUnitListQueryExample } from "#/modules/finance/dto/budgetary-unit-list-query.dto.example.ts";
import { budgetaryUnitResponseExample } from "#/modules/finance/dto/budgetary-unit-response.dto.example.ts";
import { budgetaryUnitsListResponseExample } from "#/modules/finance/dto/budgetary-units-list-response.dto.example.ts";
import { budgetsListResponseExample } from "#/modules/finance/dto/budgets-list-response.dto.example.ts";
import { expenditureListQueryExample } from "#/modules/finance/dto/expenditure-list-query.dto.example.ts";
import { expenditureResponseExample } from "#/modules/finance/dto/expenditure-response.dto.example.ts";
import { expendituresListResponseExample } from "#/modules/finance/dto/expenditures-list-response.dto.example.ts";
import { fiscalYearListQueryExample } from "#/modules/finance/dto/fiscal-year-list-query.dto.example.ts";
import { fiscalYearResponseExample } from "#/modules/finance/dto/fiscal-year-response.dto.example.ts";
import { fiscalYearsListResponseExample } from "#/modules/finance/dto/fiscal-years-list-response.dto.example.ts";
import { ledgerEntriesListResponseExample } from "#/modules/finance/dto/ledger-entries-list-response.dto.example.ts";
import { ledgerEntryListQueryExample } from "#/modules/finance/dto/ledger-entry-list-query.dto.example.ts";
import { ledgerEntryResponseExample } from "#/modules/finance/dto/ledger-entry-response.dto.example.ts";
import { revenueRecordListQueryExample } from "#/modules/finance/dto/revenue-record-list-query.dto.example.ts";
import { revenueRecordResponseExample } from "#/modules/finance/dto/revenue-record-response.dto.example.ts";
import { revenueRecordsListResponseExample } from "#/modules/finance/dto/revenue-records-list-response.dto.example.ts";
import { transferListQueryExample } from "#/modules/finance/dto/transfer-list-query.dto.example.ts";
import { transferResponseExample } from "#/modules/finance/dto/transfer-response.dto.example.ts";
import { transfersListResponseExample } from "#/modules/finance/dto/transfers-list-response.dto.example.ts";

import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";
import { FinanceFinanceReadModule } from "#/modules/finance/finance-read/finance-read.module.ts";
import { FinanceFinanceReadService } from "#/modules/finance/finance-read/finance-read.service.ts";

/**
 * Managed by Dryv: the Finance Read HTTP surface behaves as its contract says. The
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
  findBudgetaryUnits: vi.fn(),
  findBudgets: vi.fn(),
  findExpenditures: vi.fn(),
  findFiscalYears: vi.fn(),
  findLedgerEntries: vi.fn(),
  findRevenueRecords: vi.fn(),
  findTransfers: vi.fn(),
  getBudgetById: vi.fn(),
  getBudgetaryUnitById: vi.fn(),
  getExpenditureById: vi.fn(),
  getFiscalYearById: vi.fn(),
  getLedgerEntryById: vi.fn(),
  getRevenueRecordById: vi.fn(),
  getTransferById: vi.fn(),
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
    imports: [InMemoryDataSourceModule, FinanceFinanceReadModule],
  })
    .overrideProvider(FinanceFinanceReadService)
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

describe("GET /v1/finance/units (findBudgetaryUnits)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(budgetaryUnitListQueryExample.valid()), },
        headers: { },
      };
    const result = budgetaryUnitsListResponseExample.valid();
    service.findBudgetaryUnits.mockResolvedValue(result);

    const response = await send("GET", "/v1/finance/units", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findBudgetaryUnits).toHaveBeenCalledTimes(1);
    expect(service.findBudgetaryUnits).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/finance/budgets (findBudgets)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(budgetListQueryExample.valid()), },
        headers: { },
      };
    const result = budgetsListResponseExample.valid();
    service.findBudgets.mockResolvedValue(result);

    const response = await send("GET", "/v1/finance/budgets", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findBudgets).toHaveBeenCalledTimes(1);
    expect(service.findBudgets).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/finance/expenditures (findExpenditures)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(expenditureListQueryExample.valid()), },
        headers: { },
      };
    const result = expendituresListResponseExample.valid();
    service.findExpenditures.mockResolvedValue(result);

    const response = await send("GET", "/v1/finance/expenditures", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findExpenditures).toHaveBeenCalledTimes(1);
    expect(service.findExpenditures).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/finance/fiscal-years (findFiscalYears)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(fiscalYearListQueryExample.valid()), },
        headers: { },
      };
    const result = fiscalYearsListResponseExample.valid();
    service.findFiscalYears.mockResolvedValue(result);

    const response = await send("GET", "/v1/finance/fiscal-years", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findFiscalYears).toHaveBeenCalledTimes(1);
    expect(service.findFiscalYears).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/finance/ledger-entries (findLedgerEntries)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(ledgerEntryListQueryExample.valid()), },
        headers: { },
      };
    const result = ledgerEntriesListResponseExample.valid();
    service.findLedgerEntries.mockResolvedValue(result);

    const response = await send("GET", "/v1/finance/ledger-entries", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findLedgerEntries).toHaveBeenCalledTimes(1);
    expect(service.findLedgerEntries).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/finance/revenue (findRevenueRecords)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(revenueRecordListQueryExample.valid()), },
        headers: { },
      };
    const result = revenueRecordsListResponseExample.valid();
    service.findRevenueRecords.mockResolvedValue(result);

    const response = await send("GET", "/v1/finance/revenue", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findRevenueRecords).toHaveBeenCalledTimes(1);
    expect(service.findRevenueRecords).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/finance/transfers (findTransfers)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(transferListQueryExample.valid()), },
        headers: { },
      };
    const result = transfersListResponseExample.valid();
    service.findTransfers.mockResolvedValue(result);

    const response = await send("GET", "/v1/finance/transfers", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findTransfers).toHaveBeenCalledTimes(1);
    expect(service.findTransfers).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/finance/budgets/{budgetId} (getBudgetById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "budgetId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = budgetResponseExample.valid();
    service.getBudgetById.mockResolvedValue(result);

    const response = await send("GET", "/v1/finance/budgets/{budgetId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getBudgetById).toHaveBeenCalledTimes(1);
    expect(service.getBudgetById).toHaveBeenCalledWith(expect.objectContaining({ budgetId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/finance/units/{unitId} (getBudgetaryUnitById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "unitId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = budgetaryUnitResponseExample.valid();
    service.getBudgetaryUnitById.mockResolvedValue(result);

    const response = await send("GET", "/v1/finance/units/{unitId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getBudgetaryUnitById).toHaveBeenCalledTimes(1);
    expect(service.getBudgetaryUnitById).toHaveBeenCalledWith(expect.objectContaining({ unitId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/finance/expenditures/{expenditureId} (getExpenditureById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "expenditureId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = expenditureResponseExample.valid();
    service.getExpenditureById.mockResolvedValue(result);

    const response = await send("GET", "/v1/finance/expenditures/{expenditureId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getExpenditureById).toHaveBeenCalledTimes(1);
    expect(service.getExpenditureById).toHaveBeenCalledWith(expect.objectContaining({ expenditureId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/finance/fiscal-years/{fiscalYearId} (getFiscalYearById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "fiscalYearId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = fiscalYearResponseExample.valid();
    service.getFiscalYearById.mockResolvedValue(result);

    const response = await send("GET", "/v1/finance/fiscal-years/{fiscalYearId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getFiscalYearById).toHaveBeenCalledTimes(1);
    expect(service.getFiscalYearById).toHaveBeenCalledWith(expect.objectContaining({ fiscalYearId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/finance/ledger-entries/{entryId} (getLedgerEntryById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "entryId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = ledgerEntryResponseExample.valid();
    service.getLedgerEntryById.mockResolvedValue(result);

    const response = await send("GET", "/v1/finance/ledger-entries/{entryId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getLedgerEntryById).toHaveBeenCalledTimes(1);
    expect(service.getLedgerEntryById).toHaveBeenCalledWith(expect.objectContaining({ entryId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/finance/revenue/{revenueId} (getRevenueRecordById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "revenueId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = revenueRecordResponseExample.valid();
    service.getRevenueRecordById.mockResolvedValue(result);

    const response = await send("GET", "/v1/finance/revenue/{revenueId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getRevenueRecordById).toHaveBeenCalledTimes(1);
    expect(service.getRevenueRecordById).toHaveBeenCalledWith(expect.objectContaining({ revenueId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/finance/transfers/{transferId} (getTransferById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "transferId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = transferResponseExample.valid();
    service.getTransferById.mockResolvedValue(result);

    const response = await send("GET", "/v1/finance/transfers/{transferId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getTransferById).toHaveBeenCalledTimes(1);
    expect(service.getTransferById).toHaveBeenCalledWith(expect.objectContaining({ transferId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});