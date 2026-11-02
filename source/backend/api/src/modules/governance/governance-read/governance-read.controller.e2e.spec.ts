import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { geographyGovernanceResponseExample } from "#/modules/governance/dto/geography-governance-response.dto.example.ts";
import { institutionListQueryExample } from "#/modules/governance/dto/institution-list-query.dto.example.ts";
import { institutionRelationshipListQueryExample } from "#/modules/governance/dto/institution-relationship-list-query.dto.example.ts";
import { institutionRelationshipResponseExample } from "#/modules/governance/dto/institution-relationship-response.dto.example.ts";
import { institutionRelationshipsListResponseExample } from "#/modules/governance/dto/institution-relationships-list-response.dto.example.ts";
import { institutionResponseExample } from "#/modules/governance/dto/institution-response.dto.example.ts";
import { institutionsListResponseExample } from "#/modules/governance/dto/institutions-list-response.dto.example.ts";
import { officeHolderListQueryExample } from "#/modules/governance/dto/office-holder-list-query.dto.example.ts";
import { officeHolderResponseExample } from "#/modules/governance/dto/office-holder-response.dto.example.ts";
import { officeHoldersListResponseExample } from "#/modules/governance/dto/office-holders-list-response.dto.example.ts";
import { officeListQueryExample } from "#/modules/governance/dto/office-list-query.dto.example.ts";
import { officeResponseExample } from "#/modules/governance/dto/office-response.dto.example.ts";
import { officeRuleListQueryExample } from "#/modules/governance/dto/office-rule-list-query.dto.example.ts";
import { officeRuleResponseExample } from "#/modules/governance/dto/office-rule-response.dto.example.ts";
import { officeRulesListResponseExample } from "#/modules/governance/dto/office-rules-list-response.dto.example.ts";
import { officesListResponseExample } from "#/modules/governance/dto/offices-list-response.dto.example.ts";
import { peopleListResponseExample } from "#/modules/governance/dto/people-list-response.dto.example.ts";
import { personListQueryExample } from "#/modules/governance/dto/person-list-query.dto.example.ts";
import { personNameListQueryExample } from "#/modules/governance/dto/person-name-list-query.dto.example.ts";
import { personNameResponseExample } from "#/modules/governance/dto/person-name-response.dto.example.ts";
import { personNamesListResponseExample } from "#/modules/governance/dto/person-names-list-response.dto.example.ts";
import { personResponseExample } from "#/modules/governance/dto/person-response.dto.example.ts";
import { selectionProcedureListQueryExample } from "#/modules/governance/dto/selection-procedure-list-query.dto.example.ts";
import { selectionProcedureResponseExample } from "#/modules/governance/dto/selection-procedure-response.dto.example.ts";
import { selectionProceduresListResponseExample } from "#/modules/governance/dto/selection-procedures-list-response.dto.example.ts";
import { selectionStageListQueryExample } from "#/modules/governance/dto/selection-stage-list-query.dto.example.ts";
import { selectionStageResponseExample } from "#/modules/governance/dto/selection-stage-response.dto.example.ts";
import { selectionStagesListResponseExample } from "#/modules/governance/dto/selection-stages-list-response.dto.example.ts";

import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";
import { GovernanceGovernanceReadModule } from "#/modules/governance/governance-read/governance-read.module.ts";
import { GovernanceGovernanceReadService } from "#/modules/governance/governance-read/governance-read.service.ts";

/**
 * Managed by Dryv: the Governance Read HTTP surface behaves as its contract says. The
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
  findInstitutionRelationships: vi.fn(),
  findInstitutions: vi.fn(),
  findOfficeHolders: vi.fn(),
  findOfficeRules: vi.fn(),
  findOffices: vi.fn(),
  findPeople: vi.fn(),
  findPersonNames: vi.fn(),
  findSelectionProcedures: vi.fn(),
  findSelectionStages: vi.fn(),
  getGeographyGovernance: vi.fn(),
  getInstitutionById: vi.fn(),
  getInstitutionRelationshipById: vi.fn(),
  getOfficeById: vi.fn(),
  getOfficeHolderById: vi.fn(),
  getOfficeRuleById: vi.fn(),
  getPersonById: vi.fn(),
  getPersonNameById: vi.fn(),
  getSelectionProcedureById: vi.fn(),
  getSelectionStageById: vi.fn(),
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
    imports: [InMemoryDataSourceModule, GovernanceGovernanceReadModule],
  })
    .overrideProvider(GovernanceGovernanceReadService)
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

describe("GET /v1/governance/institution-relationships (findInstitutionRelationships)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(institutionRelationshipListQueryExample.valid()), },
        headers: { },
      };
    const result = institutionRelationshipsListResponseExample.valid();
    service.findInstitutionRelationships.mockResolvedValue(result);

    const response = await send("GET", "/v1/governance/institution-relationships", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findInstitutionRelationships).toHaveBeenCalledTimes(1);
    expect(service.findInstitutionRelationships).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/governance/institutions (findInstitutions)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(institutionListQueryExample.valid()), },
        headers: { },
      };
    const result = institutionsListResponseExample.valid();
    service.findInstitutions.mockResolvedValue(result);

    const response = await send("GET", "/v1/governance/institutions", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findInstitutions).toHaveBeenCalledTimes(1);
    expect(service.findInstitutions).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/governance/office-holders (findOfficeHolders)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(officeHolderListQueryExample.valid()), },
        headers: { },
      };
    const result = officeHoldersListResponseExample.valid();
    service.findOfficeHolders.mockResolvedValue(result);

    const response = await send("GET", "/v1/governance/office-holders", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findOfficeHolders).toHaveBeenCalledTimes(1);
    expect(service.findOfficeHolders).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/governance/office-rules (findOfficeRules)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(officeRuleListQueryExample.valid()), },
        headers: { },
      };
    const result = officeRulesListResponseExample.valid();
    service.findOfficeRules.mockResolvedValue(result);

    const response = await send("GET", "/v1/governance/office-rules", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findOfficeRules).toHaveBeenCalledTimes(1);
    expect(service.findOfficeRules).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/governance/offices (findOffices)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(officeListQueryExample.valid()), },
        headers: { },
      };
    const result = officesListResponseExample.valid();
    service.findOffices.mockResolvedValue(result);

    const response = await send("GET", "/v1/governance/offices", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findOffices).toHaveBeenCalledTimes(1);
    expect(service.findOffices).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/governance/people (findPeople)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(personListQueryExample.valid()), },
        headers: { },
      };
    const result = peopleListResponseExample.valid();
    service.findPeople.mockResolvedValue(result);

    const response = await send("GET", "/v1/governance/people", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findPeople).toHaveBeenCalledTimes(1);
    expect(service.findPeople).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/governance/person-names (findPersonNames)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(personNameListQueryExample.valid()), },
        headers: { },
      };
    const result = personNamesListResponseExample.valid();
    service.findPersonNames.mockResolvedValue(result);

    const response = await send("GET", "/v1/governance/person-names", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findPersonNames).toHaveBeenCalledTimes(1);
    expect(service.findPersonNames).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/governance/selection-procedures (findSelectionProcedures)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(selectionProcedureListQueryExample.valid()), },
        headers: { },
      };
    const result = selectionProceduresListResponseExample.valid();
    service.findSelectionProcedures.mockResolvedValue(result);

    const response = await send("GET", "/v1/governance/selection-procedures", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findSelectionProcedures).toHaveBeenCalledTimes(1);
    expect(service.findSelectionProcedures).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/governance/selection-stages (findSelectionStages)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { },
        query: { ...queryOf(selectionStageListQueryExample.valid()), },
        headers: { },
      };
    const result = selectionStagesListResponseExample.valid();
    service.findSelectionStages.mockResolvedValue(result);

    const response = await send("GET", "/v1/governance/selection-stages", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.findSelectionStages).toHaveBeenCalledTimes(1);
    expect(service.findSelectionStages).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/geography/entities/{entityId}/governance (getGeographyGovernance)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "entityId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = geographyGovernanceResponseExample.valid();
    service.getGeographyGovernance.mockResolvedValue(result);

    const response = await send("GET", "/v1/geography/entities/{entityId}/governance", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getGeographyGovernance).toHaveBeenCalledTimes(1);
    expect(service.getGeographyGovernance).toHaveBeenCalledWith(expect.objectContaining({ entityId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/governance/institutions/{institutionId} (getInstitutionById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "institutionId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = institutionResponseExample.valid();
    service.getInstitutionById.mockResolvedValue(result);

    const response = await send("GET", "/v1/governance/institutions/{institutionId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getInstitutionById).toHaveBeenCalledTimes(1);
    expect(service.getInstitutionById).toHaveBeenCalledWith(expect.objectContaining({ institutionId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/governance/institution-relationships/{relationshipId} (getInstitutionRelationshipById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "relationshipId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = institutionRelationshipResponseExample.valid();
    service.getInstitutionRelationshipById.mockResolvedValue(result);

    const response = await send("GET", "/v1/governance/institution-relationships/{relationshipId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getInstitutionRelationshipById).toHaveBeenCalledTimes(1);
    expect(service.getInstitutionRelationshipById).toHaveBeenCalledWith(expect.objectContaining({ relationshipId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/governance/offices/{officeId} (getOfficeById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "officeId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = officeResponseExample.valid();
    service.getOfficeById.mockResolvedValue(result);

    const response = await send("GET", "/v1/governance/offices/{officeId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getOfficeById).toHaveBeenCalledTimes(1);
    expect(service.getOfficeById).toHaveBeenCalledWith(expect.objectContaining({ officeId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/governance/office-holders/{holderId} (getOfficeHolderById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "holderId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = officeHolderResponseExample.valid();
    service.getOfficeHolderById.mockResolvedValue(result);

    const response = await send("GET", "/v1/governance/office-holders/{holderId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getOfficeHolderById).toHaveBeenCalledTimes(1);
    expect(service.getOfficeHolderById).toHaveBeenCalledWith(expect.objectContaining({ holderId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/governance/office-rules/{ruleId} (getOfficeRuleById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "ruleId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = officeRuleResponseExample.valid();
    service.getOfficeRuleById.mockResolvedValue(result);

    const response = await send("GET", "/v1/governance/office-rules/{ruleId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getOfficeRuleById).toHaveBeenCalledTimes(1);
    expect(service.getOfficeRuleById).toHaveBeenCalledWith(expect.objectContaining({ ruleId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/governance/people/{personId} (getPersonById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "personId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = personResponseExample.valid();
    service.getPersonById.mockResolvedValue(result);

    const response = await send("GET", "/v1/governance/people/{personId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getPersonById).toHaveBeenCalledTimes(1);
    expect(service.getPersonById).toHaveBeenCalledWith(expect.objectContaining({ personId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/governance/person-names/{personNameId} (getPersonNameById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "personNameId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = personNameResponseExample.valid();
    service.getPersonNameById.mockResolvedValue(result);

    const response = await send("GET", "/v1/governance/person-names/{personNameId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getPersonNameById).toHaveBeenCalledTimes(1);
    expect(service.getPersonNameById).toHaveBeenCalledWith(expect.objectContaining({ personNameId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/governance/selection-procedures/{procedureId} (getSelectionProcedureById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "procedureId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = selectionProcedureResponseExample.valid();
    service.getSelectionProcedureById.mockResolvedValue(result);

    const response = await send("GET", "/v1/governance/selection-procedures/{procedureId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getSelectionProcedureById).toHaveBeenCalledTimes(1);
    expect(service.getSelectionProcedureById).toHaveBeenCalledWith(expect.objectContaining({ procedureId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/governance/selection-stages/{stageId} (getSelectionStageById)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
        params: { "stageId": "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11", },
        query: { },
        headers: { },
      };
    const result = selectionStageResponseExample.valid();
    service.getSelectionStageById.mockResolvedValue(result);

    const response = await send("GET", "/v1/governance/selection-stages/{stageId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getSelectionStageById).toHaveBeenCalledTimes(1);
    expect(service.getSelectionStageById).toHaveBeenCalledWith(expect.objectContaining({ stageId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"), }));
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});