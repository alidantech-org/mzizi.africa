/** Canonical screen responses must not acquire undeclared legacy path fields. */
import "reflect-metadata";
import { describe, expect, it, vi } from "vitest";
import { randomUUID } from "node:crypto";
import { firstValueFrom, of } from "rxjs";
import { DataSource } from "typeorm";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";
import type { PlaceDto } from "#/modules/explorer/schema/dto/place.dto";
import { PlacePathsInterceptor } from "#/server/place-paths.interceptor.ts";

type AddressablePlace = Pick<PlaceDto, "featureId"> & Partial<Pick<PlaceDto, "canonicalPath">>;

describe("canonical explorer response compatibility", () => {
  it("leaves canonical places untouched without another slug lookup", async () => {
    const db = new DataSource({ type: "postgres", database: "unused" });
    const query = vi.spyOn(db, "query").mockResolvedValue([]);
    const place: AddressablePlace = { featureId: randomUUID(), canonicalPath: "/ke/example" };
    const interceptor = new PlacePathsInterceptor(db);
    const result = await firstValueFrom(
      interceptor.intercept(new ExecutionContextHost([]), { handle: () => of(place) }),
    );
    expect(result).toBe(place);
    expect(query).not.toHaveBeenCalled();
  });
  it("preserves legacy lookup behaviour for old place responses", async () => {
    const db = new DataSource({ type: "postgres", database: "unused" });
    const query = vi.spyOn(db, "query").mockResolvedValue([]);
    const place: AddressablePlace = { featureId: randomUUID() };
    const interceptor = new PlacePathsInterceptor(db);
    await firstValueFrom(
      interceptor.intercept(new ExecutionContextHost([]), { handle: () => of(place) }),
    );
    expect(query).toHaveBeenCalledOnce();
  });
});
