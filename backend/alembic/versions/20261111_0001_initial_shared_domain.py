"""Initial shared domain schema

Revision ID: 20261111_0001
Revises:
Create Date: 2026-11-11 02:00:00.000000+00:00

"""
from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "20261111_0001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # 1. Users
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.Column("full_name", sa.String(length=255), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("is_verified", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )
    op.create_index("ix_users_id", "users", ["id"])
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    # 2. Roles
    op.create_table(
        "roles",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(length=64), nullable=False),
        sa.Column("description", sa.String(length=255), nullable=True),
    )
    op.create_index("ix_roles_id", "roles", ["id"])
    op.create_index("ix_roles_name", "roles", ["name"], unique=True)

    # 3. Permissions
    op.create_table(
        "permissions",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("code", sa.String(length=100), nullable=False),
        sa.Column("resource", sa.String(length=64), nullable=False),
        sa.Column("action", sa.String(length=64), nullable=False),
        sa.Column("description", sa.String(length=255), nullable=True),
    )
    op.create_index("ix_permissions_id", "permissions", ["id"])
    op.create_index("ix_permissions_code", "permissions", ["code"], unique=True)

    # 4. Role <-> Permission association
    op.create_table(
        "role_permissions",
        sa.Column("role_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("roles.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("permission_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("permissions.id", ondelete="CASCADE"), primary_key=True),
    )

    # 5. User <-> Role association
    op.create_table(
        "user_roles",
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("role_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("roles.id", ondelete="CASCADE"), primary_key=True),
    )

    # 6. Organisations
    op.create_table(
        "organisations",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("slug", sa.String(length=255), nullable=False),
        sa.Column(
            "org_type",
            sa.Enum("NGO", "CSR", "PARTNER", name="organisation_type_enum"),
            nullable=False,
        ),
        sa.Column(
            "verification_status",
            sa.Enum("UNVERIFIED", "PENDING", "VERIFIED", "REJECTED", name="verification_status_enum"),
            nullable=False,
            server_default="UNVERIFIED",
        ),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )
    op.create_index("ix_organisations_id", "organisations", ["id"])
    op.create_index("ix_organisations_slug", "organisations", ["slug"], unique=True)
    op.create_index("ix_organisations_org_type", "organisations", ["org_type"])
    op.create_index("ix_organisations_verification_status", "organisations", ["verification_status"])

    # 7. Organisation Memberships
    op.create_table(
        "organisation_memberships",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("organisation_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("organisations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("role_in_org", sa.String(length=64), nullable=False),
        sa.Column(
            "status",
            sa.Enum("ACTIVE", "INVITED", "SUSPENDED", name="membership_status_enum"),
            nullable=False,
            server_default="ACTIVE",
        ),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.UniqueConstraint("organisation_id", "user_id", name="uq_org_user_membership"),
    )
    op.create_index("ix_organisation_memberships_id", "organisation_memberships", ["id"])
    op.create_index("ix_organisation_memberships_org_id", "organisation_memberships", ["organisation_id"])
    op.create_index("ix_organisation_memberships_user_id", "organisation_memberships", ["user_id"])

    # 8. Sessions
    op.create_table(
        "sessions",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("session_token_hash", sa.String(length=128), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("ip_address", sa.String(length=45), nullable=True),
        sa.Column("user_agent", sa.String(length=512), nullable=True),
        sa.Column("is_revoked", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("last_accessed_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )
    op.create_index("ix_sessions_id", "sessions", ["id"])
    op.create_index("ix_sessions_user_id", "sessions", ["user_id"])
    op.create_index("ix_sessions_token_hash", "sessions", ["session_token_hash"], unique=True)
    op.create_index("ix_sessions_expires_at", "sessions", ["expires_at"])
    op.create_index("ix_sessions_is_revoked", "sessions", ["is_revoked"])

    # 9. Consent Grants
    op.create_table(
        "consent_grants",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("consent_type", sa.String(length=100), nullable=False),
        sa.Column("purpose", sa.String(length=500), nullable=False),
        sa.Column("version", sa.String(length=32), nullable=False),
        sa.Column("granted_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("revoked_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("ip_address", sa.String(length=45), nullable=True),
    )
    op.create_index("ix_consent_grants_id", "consent_grants", ["id"])
    op.create_index("ix_consent_grants_user_id", "consent_grants", ["user_id"])
    op.create_index("ix_consent_grants_type", "consent_grants", ["consent_type"])

    # 10. Audit Events (Append-only)
    op.create_table(
        "audit_events",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("timestamp", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("actor_user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("actor_ip", sa.String(length=45), nullable=True),
        sa.Column("action", sa.String(length=128), nullable=False),
        sa.Column("resource_type", sa.String(length=64), nullable=False),
        sa.Column("resource_id", sa.String(length=128), nullable=True),
        sa.Column("organisation_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("organisations.id", ondelete="SET NULL"), nullable=True),
        sa.Column("payload", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("checksum", sa.String(length=64), nullable=True),
    )
    op.create_index("ix_audit_events_id", "audit_events", ["id"])
    op.create_index("ix_audit_events_timestamp", "audit_events", ["timestamp"])
    op.create_index("ix_audit_events_actor", "audit_events", ["actor_user_id"])
    op.create_index("ix_audit_events_action", "audit_events", ["action"])
    op.create_index("ix_audit_events_resource_type", "audit_events", ["resource_type"])
    op.create_index("ix_audit_events_resource_id", "audit_events", ["resource_id"])
    op.create_index("ix_audit_events_org_id", "audit_events", ["organisation_id"])

    # 11. File Metadata
    op.create_table(
        "file_metadata",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("storage_key", sa.String(length=512), nullable=False),
        sa.Column("original_filename", sa.String(length=255), nullable=False),
        sa.Column("mime_type", sa.String(length=128), nullable=False),
        sa.Column("file_size_bytes", sa.Integer(), nullable=False),
        sa.Column("uploaded_by_user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("organisation_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("organisations.id", ondelete="SET NULL"), nullable=True),
        sa.Column("is_sensitive", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("access_tier", sa.String(length=64), nullable=False, server_default="RESTRICTED_VERIFICATION"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )
    op.create_index("ix_file_metadata_id", "file_metadata", ["id"])
    op.create_index("ix_file_metadata_storage_key", "file_metadata", ["storage_key"], unique=True)
    op.create_index("ix_file_metadata_uploaded_by", "file_metadata", ["uploaded_by_user_id"])
    op.create_index("ix_file_metadata_org_id", "file_metadata", ["organisation_id"])
    op.create_index("ix_file_metadata_access_tier", "file_metadata", ["access_tier"])


def downgrade() -> None:
    op.drop_table("file_metadata")
    op.drop_table("audit_events")
    op.drop_table("consent_grants")
    op.drop_table("sessions")
    op.drop_table("organisation_memberships")
    op.drop_table("organisations")
    op.execute("DROP TYPE IF EXISTS membership_status_enum")
    op.execute("DROP TYPE IF EXISTS verification_status_enum")
    op.execute("DROP TYPE IF EXISTS organisation_type_enum")
    op.drop_table("user_roles")
    op.drop_table("role_permissions")
    op.drop_table("permissions")
    op.drop_table("roles")
    op.drop_table("users")
