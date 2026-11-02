"""Add versioned geography boundary provenance and name history.

Revision ID: geography_boundary_history
Revises: create_seed_events_tables
"""

from alembic import op
import sqlalchemy as sa

revision = "geography_boundary_history"
down_revision = "create_seed_events_tables"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "geo_boundary_versions",
        sa.Column("id", sa.String(length=26), primary_key=True),
        sa.Column("geo_unit_id", sa.String(length=26), sa.ForeignKey("geographic.geo_units.id", ondelete="CASCADE"), nullable=False),
        sa.Column("version_number", sa.Integer(), nullable=False),
        sa.Column("geometry", sa.JSON(), nullable=False),
        sa.Column("label_point", sa.JSON(), nullable=True),
        sa.Column("source_name", sa.String(length=300), nullable=False),
        sa.Column("source_reference", sa.Text(), nullable=False),
        sa.Column("license", sa.String(length=300), nullable=False),
        sa.Column("reference_year", sa.String(length=30), nullable=True),
        sa.Column("retrieved_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("valid_from", sa.Date(), nullable=True),
        sa.Column("valid_to", sa.Date(), nullable=True),
        sa.Column("version_label", sa.String(length=200), nullable=True),
        sa.Column("is_verified", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("is_current", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("verification_notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.UniqueConstraint("geo_unit_id", "version_number", name="uq_geo_boundary_version_number"),
        schema="geographic",
    )
    op.create_index("idx_geo_boundary_versions_validity", "geo_boundary_versions", ["geo_unit_id", "valid_from", "valid_to"], schema="geographic")
    op.create_index("idx_geo_boundary_versions_current_verified", "geo_boundary_versions", ["geo_unit_id", "is_current", "is_verified"], schema="geographic")
    op.create_index("idx_geo_boundary_versions_verified", "geo_boundary_versions", ["is_verified"], schema="geographic")
    op.create_index("idx_geo_boundary_versions_current", "geo_boundary_versions", ["is_current"], schema="geographic")
    op.create_index("idx_geo_boundary_versions_valid_from", "geo_boundary_versions", ["valid_from"], schema="geographic")
    op.create_index("idx_geo_boundary_versions_valid_to", "geo_boundary_versions", ["valid_to"], schema="geographic")

    op.create_table(
        "geo_unit_name_versions",
        sa.Column("id", sa.String(length=26), primary_key=True),
        sa.Column("geo_unit_id", sa.String(length=26), sa.ForeignKey("geographic.geo_units.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("valid_from", sa.Date(), nullable=True),
        sa.Column("valid_to", sa.Date(), nullable=True),
        sa.Column("source_reference", sa.String(length=1000), nullable=False),
        sa.UniqueConstraint("geo_unit_id", "name", "valid_from", name="uq_geo_unit_name_version"),
        schema="geographic",
    )
    op.create_index("idx_geo_unit_name_validity", "geo_unit_name_versions", ["geo_unit_id", "valid_from", "valid_to"], schema="geographic")

    op.create_table(
        "geo_unit_change_relationships",
        sa.Column("id", sa.String(length=26), primary_key=True),
        sa.Column("source_geo_unit_id", sa.String(length=26), sa.ForeignKey("geographic.geo_units.id", ondelete="CASCADE"), nullable=False),
        sa.Column("target_geo_unit_id", sa.String(length=26), sa.ForeignKey("geographic.geo_units.id", ondelete="CASCADE"), nullable=False),
        sa.Column("relation_type", sa.String(length=30), nullable=False),
        sa.Column("valid_from", sa.Date(), nullable=False),
        sa.Column("valid_to", sa.Date(), nullable=True),
        sa.Column("source_reference", sa.Text(), nullable=False),
        sa.CheckConstraint(
            "relation_type IN ('renamed_to', 'split_into', 'merged_into', 'continued_as')",
            name="ck_geo_unit_change_relationship_type",
        ),
        sa.UniqueConstraint("source_geo_unit_id", "target_geo_unit_id", "relation_type", "valid_from", name="uq_geo_unit_change_relationship"),
        schema="geographic",
    )
    op.create_index("idx_geo_unit_change_source", "geo_unit_change_relationships", ["source_geo_unit_id", "valid_from"], schema="geographic")
    op.create_index("idx_geo_unit_change_target", "geo_unit_change_relationships", ["target_geo_unit_id", "valid_from"], schema="geographic")


def downgrade() -> None:
    op.drop_table("geo_unit_change_relationships", schema="geographic")
    op.drop_table("geo_unit_name_versions", schema="geographic")
    op.drop_table("geo_boundary_versions", schema="geographic")
