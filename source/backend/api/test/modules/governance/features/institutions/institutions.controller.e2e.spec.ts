import "reflect-metadata";

import { Global, type INestApplication, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getDataSourceToken } from "@nestjs/typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { institutionCollectionExample } from "@test/modules/governance/schema/dto/examples/institution-collection.dto.example.ts";
import { institutionDetailExample } from "@test/modules/governance/schema/dto/examples/institution-detail.dto.example.ts";
import { institutionKeyExample } from "@test/modules/governance/schema/dto/examples/institution-key.dto.example.ts";
import { institutionWindowExample } from "@test/modules/governance/schema/dto/examples/institution-window.dto.example.ts";
import { officeDetailExample } from "@test/modules/governance/schema/dto/examples/office-detail.dto.example.ts";
import { officeKeyExample } from "@test/modules/governance/schema/dto/examples/office-key.dto.example.ts";

import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";
import { GovernanceInstitutionsModule } from "#/modules/governance/features/institutions/institutions.module.ts";
import { GovernanceInstitutionsService } from "#/modules/governance/features/institutions/institutions.service.ts";

/**
 * Managed by Dryv: the Institutions HTTP surface behaves as its contract says. The
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
  browseInstitutions: vi.fn(),
  getInstitution: vi.fn(),
  getOffice: vi.fn(),
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
    imports: [InMemoryDataSourceModule, GovernanceInstitutionsModule],
  })
    .overrideProvider(GovernanceInstitutionsService)
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

describe("GET /v1/governance/institutions (browseInstitutions)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: {},
      query: { ...queryOf(institutionWindowExample.valid()) },
      headers: {},
    };
    const result = institutionCollectionExample.valid();
    service.browseInstitutions.mockResolvedValue(result);

    const response = await send("GET", "/v1/governance/institutions", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.browseInstitutions).toHaveBeenCalledTimes(1);
    expect(service.browseInstitutions).toHaveBeenCalledWith(expect.anything());
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/governance/institutions/{institutionId} (getInstitution)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: { institutionId: "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11" },
      query: {},
      headers: {},
    };
    const result = institutionDetailExample.valid();
    service.getInstitution.mockResolvedValue(result);

    const response = await send("GET", "/v1/governance/institutions/{institutionId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getInstitution).toHaveBeenCalledTimes(1);
    expect(service.getInstitution).toHaveBeenCalledWith(
      expect.objectContaining({
        institutionId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"),
      }),
    );
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});

describe("GET /v1/governance/offices/{officeId} (getOffice)", () => {
  it("passes a valid request to the service and answers with the contract status", async () => {
    const sent: Sent = {
      params: { officeId: "7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11" },
      query: {},
      headers: {},
    };
    const result = officeDetailExample.valid();
    service.getOffice.mockResolvedValue(result);

    const response = await send("GET", "/v1/governance/offices/{officeId}", sent);

    expect(response.status, await response.clone().text()).toBe(200);
    expect(service.getOffice).toHaveBeenCalledTimes(1);
    expect(service.getOffice).toHaveBeenCalledWith(
      expect.objectContaining({
        officeId: String("7f1c1f52-2f58-4a4e-9b43-0c1a3c1b0a11"),
      }),
    );
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(result)));
  });
});
