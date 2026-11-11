# HUMANE — System Architecture Design

This document describes the high-level system architecture, multi-tenant boundaries, cross-cutting subsystems, and component topologies for the HUMANE platform.

> [!NOTE]
> All designs described herein represent the foundational baseline for HUMANE. Specific domain workflows (e.g. Volunteer verification flows, NGO project management, and CSR reporting) remain subject to review and explicit approval before implementation.

---

## 1. High-Level Topology

HUMANE is deployed as a coordinated pair of frontend (Next.js) and backend (FastAPI) applications communicating over secure RESTful JSON APIs, backed by a relational PostgreSQL database and private Azure Blob Storage.

```mermaid
flowchart TD
    subgraph Clients["Clients & Stakeholders"]
        V[Volunteers]
        N[NGO Staff & Leadership]
        C[CSR Program Managers & Analysts]
        A[Platform Operations / Admins]
    end

    subgraph Edge["Edge & Security Layer"]
        CDN[Azure Front Door / TLS Termination]
        WAF[WAF & Rate Limiting]
    end

    subgraph AppPlane["Application Compute (Azure Container Apps)"]
        FE["Frontend (Next.js 15 App Router)\nSSR & Client Components"]
        BE["Backend (FastAPI Modular Monolith)\nAsync Request Pipeline"]
    end

    subgraph CoreServices["Shared Platform Services (Backend Modules)"]
        AUTH["Auth & Session Service\n(HTTP-only Cookies, SHA-256 Tokens)"]
        RBAC["RBAC & Tenant Engine\n(Org Boundary Enforcer)"]
        AUDIT["Immutable Audit Logger\n(Append-only with Checksums)"]
        CONSENT["Consent & Privacy Manager\n(Explicit & Revocable Grants)"]
        NOTIF["Notification Hub\n(Email / In-App)"]
        DOCS["Document Registry & Storage\n(Encrypted Private Blobs)"]
    end

    subgraph Ecosystems["Ecosystem Domain Modules"]
        VOL_MOD["Volunteer Domain\n(Profiles, Shifts, Skills)"]
        NGO_MOD["NGO Domain\n(Verification, Projects, Beneficiaries)"]
        CSR_MOD["CSR Domain\n(Grants, Verified Impact, Metrics)"]
    end

    subgraph DataStorage["Data & Persistence Layer"]
        PG[(PostgreSQL 16+\nRow-Level Tenant Boundary)]
        BLOB[(Azure Blob Storage\nPrivate Sensitive Docs)]
    end

    V & N & C & A --> CDN
    CDN --> WAF
    WAF --> FE
    FE -->|API Calls with Session Cookie| BE

    BE --> AUTH
    BE --> RBAC
    BE --> AUDIT
    BE --> CONSENT
    BE --> NOTIF
    BE --> DOCS

    AUTH & RBAC & AUDIT & CONSENT --> VOL_MOD
    AUTH & RBAC & AUDIT & CONSENT --> NGO_MOD
    AUTH & RBAC & AUDIT & CONSENT --> CSR_MOD

    BE --> PG
    DOCS --> BLOB
```

---

## 2. Three-Sided Ecosystem Architecture & Boundary Separation

```mermaid
graph LR
    subgraph VolunteerEcosystem["1. Volunteers"]
        V1["Free Account & Profile"]
        V2["Skill Inventory"]
        V3["Hour & Impact Logging"]
        V4["Consent Dashboard"]
    end

    subgraph NgoEcosystem["2. NGOs & Grassroots"]
        N1["Zero-Paywall Org Space"]
        N2["Project & Opportunity Management"]
        N3["Beneficiary Safeguarding Records"]
        N4["Verification Document Vault"]
    end

    subgraph CsrEcosystem["3. CSR & Donors"]
        C1["Grant Making & Allocation"]
        C2["Verified Outcome Dashboard"]
        C3["Employee Volunteering Track"]
        C4["Compliance Audit Export"]
    end

    subgraph Boundary["Shared Security & Boundary Firewall"]
        F1["Strict Tenant Isolation"]
        F2["Beneficiary PII Masking"]
        F3["Human Verification Gate"]
        F4["No Fabricated Metrics Engine"]
    end

    VolunteerEcosystem --- Boundary
    NgoEcosystem --- Boundary
    CsrEcosystem --- Boundary
```

### Architectural Safeguards:
1. **NGO Data Sovereignty**: CSR partners never receive direct query access to NGO internal tables. CSR dashboards query aggregated or explicitly consented milestone deliverables.
2. **Beneficiary Dignity & PII Protection**: Beneficiary identity records are encrypted, never sold, and restricted behind strict role checks.
3. **No Synthetic Workflows**: Aggregated impact metrics compute live from verified database rows.

---

## 3. Request Lifecycle & Security Middleware

Each HTTP request traversing the backend pipeline undergoes a deterministic sequence of security checks:

```mermaid
sequenceDiagram
    autonumber
    actor User as Client Browser
    participant API as FastAPI Gateway
    participant SessionSec as Session Middleware
    participant RBAC as Tenant & Permission Guard
    participant Handler as Domain Endpoint Handler
    participant DB as PostgreSQL
    participant Audit as Audit Log Service

    User->>API: HTTP Request + Cookie
    API->>SessionSec: Extract Session Cookie
    SessionSec->>DB: Lookup Hash(Token) & check expires_at / is_revoked
    alt Invalid or Expired Session
        SessionSec-->>User: 401 Unauthorized (Clear Cookie)
    else Active Session
        SessionSec->>RBAC: Pass authenticated User & Active Org Context
        RBAC->>RBAC: Validate Role, Permissions, and Tenant Boundary
        alt Forbidden
            RBAC-->>User: 403 Forbidden (Tenant / Permission Mismatch)
        else Authorized
            RBAC->>Handler: Dispatch Request
            Handler->>DB: Execute Business Logic within Transaction
            Handler->>Audit: Record AuditEvent (Actor, Action, Resource, IP)
            Audit->>DB: Append immutable audit record
            Handler-->>User: 200 OK / 201 Created (JSON Payload)
        end
    end
```

---

## 4. Multi-Tenant Model & Data Isolation

HUMANE supports multi-tenancy at the **shared database, shared schema** level with explicit foreign key tenant identifiers (`organisation_id`), foreign key constraints, and query-level tenant filters:

- **Global Entities**: `users`, `roles`, `permissions`, `sessions` (identity is portable across ecosystems).
- **Tenant Entities**: `organisations` (NGOs, CSR Partners, Foundations).
- **Tenant Association**: `organisation_memberships` binds users to organisations with roles (`OWNER`, `ADMIN`, `MEMBER`, `ANALYST`).
- **Resource Ownership**: Every organization-scoped resource has an indexed `organisation_id` foreign key.
- **Service-Level Filtering**: Repositories enforce `WHERE organisation_id = :active_org_id` on all tenant-specific queries.

---

## 5. Audit Logging Architecture

All state mutations, security events, verification determinations, and consent grants write to the `audit_events` table:

- **Immutability**: Database privileges forbid `UPDATE` or `DELETE` on the `audit_events` table.
- **Traceability**: Records capture `actor_user_id`, `actor_ip`, `action`, `resource_type`, `resource_id`, and `organisation_id`.
- **Integrity Checksums**: Sensitive events record an SHA-256 payload checksum for tamper detection.

---

## 6. Document Storage & Access Control

Sensitive legal proofs (e.g., 12A/80G tax exemptions, FCRA certificates, government IDs, and safeguarding reports) are stored in **private Azure Blob Storage**:

- **No Public Blobs**: Storage containers block all anonymous public access.
- **Metadata in PostgreSQL**: `file_metadata` records store storage keys, MIME types, file sizes, uploading actor, and sensitivity level (`access_tier`).
- **Expiring SAS URLs**: Downloads and uploads are authorized strictly via short-lived (e.g. 15-minute) Shared Access Signature (SAS) tokens generated on demand after verifying user permissions.
