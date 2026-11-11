import enum
import uuid
from datetime import UTC, datetime
from typing import Any

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    Table,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import TimestampMixin, UUIDMixin


class OrganisationType(str, enum.Enum):
    NGO = "NGO"
    CSR = "CSR"
    PARTNER = "PARTNER"


class VerificationStatus(str, enum.Enum):
    UNVERIFIED = "UNVERIFIED"
    PENDING = "PENDING"
    VERIFIED = "VERIFIED"
    REJECTED = "REJECTED"


class MembershipStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    INVITED = "INVITED"
    SUSPENDED = "SUSPENDED"


# Association table for Role <-> Permission
role_permissions = Table(
    "role_permissions",
    Base.metadata,
    Column(
        "role_id", UUID(as_uuid=True), ForeignKey("roles.id", ondelete="CASCADE"), primary_key=True
    ),
    Column(
        "permission_id",
        UUID(as_uuid=True),
        ForeignKey("permissions.id", ondelete="CASCADE"),
        primary_key=True,
    ),
)

# Association table for User <-> Role (System & ecosystem roles)
user_roles = Table(
    "user_roles",
    Base.metadata,
    Column(
        "user_id", UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    ),
    Column(
        "role_id", UUID(as_uuid=True), ForeignKey("roles.id", ondelete="CASCADE"), primary_key=True
    ),
)


class User(Base, UUIDMixin, TimestampMixin):
    """User identity record across all three ecosystems."""

    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Relationships
    sessions: Mapped[list["Session"]] = relationship(
        "Session", back_populates="user", cascade="all, delete-orphan"
    )
    roles: Mapped[list["Role"]] = relationship("Role", secondary=user_roles, back_populates="users")
    memberships: Mapped[list["OrganisationMembership"]] = relationship(
        "OrganisationMembership", back_populates="user", cascade="all, delete-orphan"
    )
    consents: Mapped[list["ConsentGrant"]] = relationship(
        "ConsentGrant", back_populates="user", cascade="all, delete-orphan"
    )


class Session(Base, UUIDMixin):
    """Server-side authenticated session."""

    __tablename__ = "sessions"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    session_token_hash: Mapped[str] = mapped_column(
        String(128), unique=True, index=True, nullable=False
    )
    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, index=True
    )
    ip_address: Mapped[str | None] = mapped_column(String(45), nullable=True)
    user_agent: Mapped[str | None] = mapped_column(String(512), nullable=True)
    is_revoked: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False
    )
    last_accessed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False
    )

    user: Mapped["User"] = relationship("User", back_populates="sessions")


class Role(Base, UUIDMixin):
    """RBAC Role definition."""

    __tablename__ = "roles"

    name: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    description: Mapped[str | None] = mapped_column(String(255), nullable=True)

    permissions: Mapped[list["Permission"]] = relationship(
        "Permission", secondary=role_permissions, back_populates="roles"
    )
    users: Mapped[list["User"]] = relationship("User", secondary=user_roles, back_populates="roles")


class Permission(Base, UUIDMixin):
    """Fine-grained permission code."""

    __tablename__ = "permissions"

    code: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    resource: Mapped[str] = mapped_column(String(64), nullable=False)
    action: Mapped[str] = mapped_column(String(64), nullable=False)
    description: Mapped[str | None] = mapped_column(String(255), nullable=True)

    roles: Mapped[list["Role"]] = relationship(
        "Role", secondary=role_permissions, back_populates="permissions"
    )


class Organisation(Base, UUIDMixin, TimestampMixin):
    """Tenant / organisation boundary for NGOs and CSR partners."""

    __tablename__ = "organisations"

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    org_type: Mapped[OrganisationType] = mapped_column(
        Enum(OrganisationType, name="organisation_type_enum"), nullable=False, index=True
    )
    verification_status: Mapped[VerificationStatus] = mapped_column(
        Enum(VerificationStatus, name="verification_status_enum"),
        default=VerificationStatus.UNVERIFIED,
        nullable=False,
        index=True,
    )

    memberships: Mapped[list["OrganisationMembership"]] = relationship(
        "OrganisationMembership", back_populates="organisation", cascade="all, delete-orphan"
    )


class OrganisationMembership(Base, UUIDMixin, TimestampMixin):
    """User membership and role within a specific Organisation."""

    __tablename__ = "organisation_memberships"

    organisation_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("organisations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    role_in_org: Mapped[str] = mapped_column(String(64), nullable=False)
    status: Mapped[MembershipStatus] = mapped_column(
        Enum(MembershipStatus, name="membership_status_enum"),
        default=MembershipStatus.ACTIVE,
        nullable=False,
    )

    organisation: Mapped["Organisation"] = relationship(
        "Organisation", back_populates="memberships"
    )
    user: Mapped["User"] = relationship("User", back_populates="memberships")

    __table_args__ = (
        UniqueConstraint("organisation_id", "user_id", name="uq_org_user_membership"),
    )


class ConsentGrant(Base, UUIDMixin):
    """Explicit, audit-trailed consent granted by users or beneficiaries."""

    __tablename__ = "consent_grants"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    consent_type: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    purpose: Mapped[str] = mapped_column(String(500), nullable=False)
    version: Mapped[str] = mapped_column(String(32), nullable=False)
    granted_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False
    )
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    ip_address: Mapped[str | None] = mapped_column(String(45), nullable=True)

    user: Mapped["User"] = relationship("User", back_populates="consents")


class AuditEvent(Base, UUIDMixin):
    """Immutable audit trail for all significant operations, security, and verification actions."""

    __tablename__ = "audit_events"

    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
        index=True,
    )
    actor_user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True
    )
    actor_ip: Mapped[str | None] = mapped_column(String(45), nullable=True)
    action: Mapped[str] = mapped_column(String(128), nullable=False, index=True)
    resource_type: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    resource_id: Mapped[str | None] = mapped_column(String(128), nullable=True, index=True)
    organisation_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("organisations.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    payload: Mapped[dict[str, Any] | None] = mapped_column(JSONB, nullable=True)
    checksum: Mapped[str | None] = mapped_column(String(64), nullable=True)


class FileMetadata(Base, UUIDMixin, TimestampMixin):
    """Metadata registry for sensitive documents uploaded to private storage."""

    __tablename__ = "file_metadata"

    storage_key: Mapped[str] = mapped_column(String(512), unique=True, index=True, nullable=False)
    original_filename: Mapped[str] = mapped_column(String(255), nullable=False)
    mime_type: Mapped[str] = mapped_column(String(128), nullable=False)
    file_size_bytes: Mapped[int] = mapped_column(Integer, nullable=False)
    uploaded_by_user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    organisation_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("organisations.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    is_sensitive: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    access_tier: Mapped[str] = mapped_column(
        String(64), default="RESTRICTED_VERIFICATION", nullable=False, index=True
    )
