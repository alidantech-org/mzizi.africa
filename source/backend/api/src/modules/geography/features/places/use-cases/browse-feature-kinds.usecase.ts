import { Injectable } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { getDataSourceToken } from "@nestjs/typeorm";
import type { DataSource } from "typeorm";
import type { FeatureKindCollectionDto } from "#/modules/geography/schema/dto/feature-kind-collection.dto";
import { SchemeEntity } from "#/modules/reference/schema/entities/scheme.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { ValueRepository } from "#/modules/reference/schema/repositories/value.repository.ts";

/**
 * The classification scheme whose members are the feature kinds. It is the scheme the contract tags the
 * `featureTypeId` field with (`scheme:ref.sch.geo.feature.kind`); a Dryv query cannot bind a constant
 * parameter, so this one named value stands in until it can.
 */
const FEATURE_KIND_SCHEME = "ref.sch.geo.feature.kind";

/** One selected row, named after the response fields. */
interface KindRow {
  id: string;
  code: string;
  label: string;
}

/**
 * The kinds a geographic feature can have, in code order, for choosing a feature type.
 *
 * Scaffolded by Dryv once; this file belongs to the project. It reads the members of one reference scheme
 * through the generated value repository; retired members (soft-deleted) are left out.
 */
@Injectable()
export class BrowseFeatureKindsUseCase {
  constructor(private readonly moduleRef: ModuleRef) {}

  async execute(): Promise<FeatureKindCollectionDto> {
    const dataSource = this.moduleRef.get<DataSource>(getDataSourceToken(), { strict: false });
    const repository = new ValueRepository(dataSource.getRepository(ValueEntity));
    const kinds = await repository
      .query("v")
      .select([])
      .innerJoin(SchemeEntity, "s", "s.id = v.schemeId")
      .where("s.code = :scheme", { scheme: FEATURE_KIND_SCHEME })
      .andWhere("v.deletedAt IS NULL")
      .addSelect("v.id", "id")
      .addSelect("v.code", "code")
      .addSelect("v.label", "label")
      .orderBy("v.code", "ASC")
      .addOrderBy("v.id", "ASC")
      .getRawMany<KindRow>();
    return { kinds };
  }
}
