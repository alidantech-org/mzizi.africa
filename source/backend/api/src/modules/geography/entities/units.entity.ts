import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";

import { FeaturesEntity } from "#/modules/geography/entities/features.entity.ts";
import { CountryEntity } from "#/modules/reference/entities/country.entity.ts";
import type { Id } from "#/modules/shared/id.type.ts";

/**
 * A formally defined administrative, electoral, statistical or historical territorial specialization of one feature; country membership is optional for historic and cross-border units.
 */
@Entity({ schema: "geography", name: "units" })
@Index(["countryId"])
@Index(["validFrom", "validUntil"])
@Check("chk_units_effective_window_must_be_ordered", `valid_from = null OR valid_until = null OR valid_from < valid_until`)
export class UnitsEntity {

  @PrimaryColumn({ name: "feature_id", type: "uuid" })
  featureId!: Id;

  @OneToOne(() => FeaturesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "feature_id" })
  feature?: Relation<FeaturesEntity>;

  @Column({ name: "country_id", type: "uuid", nullable: true })
  countryId?: Id | null;

  @ManyToOne(() => CountryEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "country_id" })
  country?: Relation<CountryEntity>;

  @Column({ name: "valid_from", type: "date", nullable: true })
  validFrom?: Date | null;

  @Column({ name: "valid_until", type: "date", nullable: true })
  validUntil?: Date | null;
}