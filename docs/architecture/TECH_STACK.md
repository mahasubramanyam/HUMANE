# HUMANE — Approved Technology Stack & Architectural Decision Record

This document details the approved technology stack for HUMANE, an interconnected three-sided platform serving **Volunteers**, **NGOs/Implementing Organisations**, and **CSR Partners/Corporate Donors**.

---

## 1. Architectural Philosophy: The Modular Monolith

Rather than introducing distributed microservices, service meshes, or Kubernetes complexity at inception, HUMANE is structured as a **modular monolith** with clearly separated frontend and backend applications.

### Core Rationales
- **Unified Identity & Permissions**: A single platform requires atomic transactions across users, sessions, organisations, memberships, audit events, and consent records.
- **Operational Simplicity**: Avoids distributed consensus, network latency, and multi-repository synchronization hurdles during early product velocity.
- **Strict Domain Boundaries**: Scoped internal boundaries (e.g. `modules/volunteer`, `modules/ngo`, `modules/csr`, `modules/shared`) ensure clean separation without network overhead.
- **Future Extraction Path**: If specific domain workloads (e.g., intensive document OCR or background notification bursts) require isolation, bounded modules can be decomposed into dedicated workers cleanly.

---

## 2. Frontend Technology Stack

| Layer / Library | Technology | Selection Rationale & Implementation Details |
| :--- | :--- | :--- |
| **Framework** | Next.js 15+ (App Router) | Modern server components, optimized asset streaming, route handlers, robust SEO, and production-grade hydration performance. |
| **Core UI Library** | React 19 / TypeScript (Strict Mode) | Strong type-safety eliminates an entire class of runtime regressions. Strict mode is enforced globally with `@/*` path mapping. |
| **Styling** | Tailwind CSS | Utility-first CSS ensuring design consistency across all three ecosystems with unified HSL color token variables. |
| **Component Kit** | shadcn/ui | Accessible, unstyled primitives (Radix UI) customizable in-tree without vendor locking. |
| **Server State** | TanStack Query v5 | Declarative server-state caching, automatic background invalidation, and optimistic updates. |
| **Forms & Validation** | React Hook Form + Zod | High-performance, re-render minimized forms with schema-driven, runtime-validated contracts. |
| **Icons** | Lucide React | Consistent, accessible, and lightweight icon library. |
| **Unit Testing** | Vitest + Testing Library | High-speed ESM testing in jsdom environment with React Testing Library. |
| **E2E Testing** | Playwright | Multi-browser headless automation (Chromium, Firefox, WebKit) for end-to-end user journeys. |

---

## 3. Backend Technology Stack

| Layer / Library | Technology | Selection Rationale & Implementation Details |
| :--- | :--- | :--- |
| **Runtime & Language** | Python 3.11+ | High expressiveness, robust typing, mature data processing ecosystem, and extensive enterprise integrations. |
| **Web Framework** | FastAPI (ASGI) | Asynchronous, OpenAPI-native, high-performance web framework with automated Swagger/ReDoc generation and dependency injection. |
| **Validation & Schema** | Pydantic v2 & Pydantic Settings | Rust-backed deserialization and strict runtime typing for requests, responses, and environment configurations. |
| **ORM & Database Layer**| SQLAlchemy 2.0 (Async + Sync) | Fully typed declarative models. Utilizes `asyncpg` for high-throughput ASGI request handlers and `psycopg2` for synchronous tooling/migrations. |
| **Database Migrations** | Alembic | Version-controlled, reproducible database schema management with rollback capabilities. |
| **Linting & Formatting**| Ruff | Extremely fast Python linter and formatter configured to replace flake8, black, and isort. |
| **Testing** | Pytest + pytest-asyncio + HTTPX | Asynchronous test execution with in-memory SQLite / PostgreSQL test harnesses. |

---

## 4. Database & Storage Architecture

| System | Technology | Guarantees & Configuration |
| :--- | :--- | :--- |
| **Relational Database** | PostgreSQL 16+ | ACID compliance, UUIDv4 primary keys, JSONB for immutable audit payloads, strict foreign key constraints, and multi-tenant indexes. |
| **Migration Tooling** | Alembic | Linear revision tracking stored in `backend/alembic/versions/`. No ad-hoc schema modifications permitted in production. |
| **Document Storage** | Private Object Storage (Azure Blob Storage) | Tiered private storage for sensitive verification documents, 80G/12A certificates, and beneficiary identification files with expiring SAS tokens. |
| **Cache & Queue** | Redis (deferred until justified) | Kept out of initial baseline to avoid unnecessary operational baggage until actual worker workloads (e.g. bulk emails or batch exports) demand it. |

---

## 5. Authentication, Authorization & Security Baseline

- **Session Management**: Server-side session tokens stored as cryptographic hashes (SHA-256) in PostgreSQL.
- **Cookies**: HTTP-only, SameSite (`Lax`/`Strict`), and `Secure` (in production) flags prevent XSS access.
- **CSRF Protection**: State-changing operations require double-submit or synchronizer tokens.
- **Password Security**: Bcrypt with salted rounds.
- **Authorization**: Server-side Role-Based Access Control (RBAC) and organisation tenant boundaries checked at the route/service level. No privilege is granted solely via frontend state.
- **Immutable Audit Trail**: Append-only `audit_events` table capturing actor, action, IP, resource, and payload checksum.

---

## 6. Infrastructure & Deployment Target

- **Deployment Platform**: Azure Container Apps (serverless container hosting with automated horizontal scaling, ingress TLS, and secret management).
- **CI/CD**: GitHub Actions for linting, type-checking, automated unit testing, and container build validation.
- **Local Development**: Runs without requiring Docker (Node.js + Python venv + local PostgreSQL).
