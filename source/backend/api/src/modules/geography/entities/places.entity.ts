import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { FeaturesEntity } from "#/modules/geography/entities/features.entity.ts";
import type { Flag } from "#/modules/shared/type/flag.type.ts";
import type { Id } from "#/modules/shared/type/id.type.ts";

/**
 * Optional physical-place attributes for a feature; does not create a separate identity.
 */
@Entity({ schema: "geography", name: "places" })
export class PlacesEntity {

  @PrimaryColumn({ name: "feature_id", type: "uuid" })
  featureId!: Id;

  @OneToOne(() => FeaturesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "feature_id" })
  feature?: Relation<FeaturesEntity>;

  @Column({ name: "is_inhabited", type: "boolean", nullable: true })
  isInhabited?: Flag | null;
}