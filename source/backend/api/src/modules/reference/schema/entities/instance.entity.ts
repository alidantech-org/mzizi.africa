import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { FeaturesEntity } from "#/modules/geography/schema/entities/features.entity.ts";
import { InstitutionsEntity } from "#/modules/governance/schema/entities/institutions.entity.ts";
import { OfficesEntity } from "#/modules/governance/schema/entities/offices.entity.ts";
import { PositionsEntity } from "#/modules/governance/schema/entities/positions.entity.ts";
import { ContactsEntity } from "#/modules/official/schema/entities/contacts.entity.ts";
import { TemplateEntity } from "#/modules/reference/schema/entities/template.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import { DomainsEntity } from "#/modules/source/schema/entities/domains.entity.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * The ledger of generated records: which template produced which institution, position, office, site or contact, for which unit, and whether it is still only expected or has been sourced or verified.
 */
@Entity({ schema: "reference", name: "instances" })
@Index(["templateId", "unitFeatureId"], { unique: true })
@Index(["templateId"])
@Index(["unitFeatureId"])
@Index(["institutionId"])
@Index(["positionId"])
@Index(["officeId"])
@Index(["domainId"])
@Index(["contactId"])
@Index(["statusId"])
@Index(["verifiedCitationId"])
// Invariant "HasExactlyOneProduct" has no simple form, so it isn't enforced as a database check.
export class InstanceEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "contact_id", type: "uuid", nullable: true })
  contactId?: Id | null;

  @ManyToOne(() => ContactsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "contact_id" })
  contact?: Relation<ContactsEntity>;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "domain_id", type: "uuid", nullable: true })
  domainId?: Id | null;

  @ManyToOne(() => DomainsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "domain_id" })
  domain?: Relation<DomainsEntity>;

  @Column({ name: "generated_at", type: "timestamptz" })
  generatedAt!: Date;

  @Column({ name: "institution_id", type: "uuid", nullable: true })
  institutionId?: Id | null;

  @ManyToOne(() => InstitutionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "institution_id" })
  institution?: Relation<InstitutionsEntity>;

  @Column({ name: "office_id", type: "uuid", nullable: true })
  officeId?: Id | null;

  @ManyToOne(() => OfficesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "office_id" })
  office?: Relation<OfficesEntity>;

  @Column({ name: "position_id", type: "uuid", nullable: true })
  positionId?: Id | null;

  @ManyToOne(() => PositionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "position_id" })
  position?: Relation<PositionsEntity>;

  @Column({ name: "status_id", type: "uuid" })
  statusId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "status_id" })
  status?: Relation<ValueEntity>;

  @Column({ name: "template_id", type: "uuid" })
  templateId!: Id;

  @ManyToOne(() => TemplateEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "template_id" })
  template?: Relation<TemplateEntity>;

  @Column({ name: "unit_feature_id", type: "uuid", nullable: true })
  unitFeatureId?: Id | null;

  @ManyToOne(() => FeaturesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "unit_feature_id" })
  unitFeature?: Relation<FeaturesEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "verified_citation_id", type: "uuid", nullable: true })
  verifiedCitationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "verified_citation_id" })
  verifiedCitation?: Relation<CitationsEntity>;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
