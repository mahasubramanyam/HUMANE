# HUMANE — Monorepo Project Structure & Module Responsibilities

This document defines the folder structure and boundary responsibilities for the HUMANE repository.

---

## 1. Top-Level Directory Layout

```
HUMANE/
├── .github/
│   └── workflows/              # GitHub Actions CI/CD pipelines
├── backend/                    # Python FastAPI application & migrations
├── docs/                       # Project documentation
│   ├── architecture/           # Technical stacks, architecture designs, topologies
│   ├── database/               # Shared domain schema, migration docs, indexing
│   ├── implementation/         # Phased implementation roadmaps
│   ├── reference/              # Product principles, compliance standards, references
│   └── security/               # Security baselines, threat model, compliance
├── frontend/                   # Next.js 15+ App Router frontend application
├── infrastructure/             # Cloud infrastructure definitions (Azure Container Apps)
│   ├── azure/                  # Container app, database, and storage configurations
│   └── docker/                 # Container definition files
├── scripts/                    # Automation scripts for local setup & maintenance
├── .env.example                # Global environment configuration template (placeholders only)
├── .gitignore                  # Git ignore rules for node, python, secrets, builds
└── README.md                   # Repository overview and getting started guide
```

---

## 2. Frontend Structure (`frontend/`)

The frontend application uses Next.js 15 with App Router, TypeScript in strict mode, and Tailwind CSS. Features are modularized into domain directories:

```
frontend/
├── e2e/                        # Playwright end-to-end test specs
│   └── home.spec.ts
├── src/
│   ├── app/                    # Next.js App Router root
│   │   ├── globals.css         # Global Tailwind styles & CSS variables
│   │   ├── layout.tsx          # Root HTML layout with providers
│   │   ├── page.tsx            # Platform home page
│   │   └── providers.tsx       # TanStack Query & Client Context providers
│   ├── components/             # Reusable design system components
│   │   └── ui/                 # Atomic shadcn/ui components (button, card, badge)
│   ├── features/               # Domain-specific feature modules
│   │   ├── volunteer/          # Volunteer workflows (discovery, profiles, shifts)
│   │   ├── ngo/                # NGO workflows (onboarding, projects, beneficiaries)
│   │   ├── csr/                # CSR workflows (grants, impact tracking, employee engagement)
│   │   └── shared/             # Cross-ecosystem navigation, shell, layout & auth
│   ├── lib/                    # Shared utilities (cn helper, formatting)
│   └── test/                   # Vitest setup & testing utilities
├── components.json             # shadcn/ui configuration
├── package.json                # Frontend package configuration & npm scripts
├── playwright.config.ts        # Playwright E2E configuration
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.ts          # Tailwind theme & ecosystem color tokens
├── tsconfig.json               # TypeScript configuration with strict mode enabled
└── vitest.config.ts            # Vitest unit test configuration
```

---

## 3. Backend Structure (`backend/`)

The backend is built as a FastAPI modular monolith with SQLAlchemy 2.0 and Alembic:

```
backend/
├── alembic/                    # Database migration configuration
│   ├── versions/               # Linear database migration scripts
│   │   └── 20261111_0001_initial_shared_domain.py
│   ├── env.py                  # Alembic runtime environment (reads settings)
│   └── script.py.mako          # Migration template
├── app/
│   ├── api/                    # API routing layer
│   │   └── v1/
│   │       ├── endpoints/      # Route handlers (health, etc.)
│   │       │   └── health.py
│   │       └── router.py       # Central v1 APIRouter
│   ├── core/                   # Cross-cutting foundational modules
│   │   ├── config.py           # Pydantic Settings with strict validation
│   │   ├── database.py         # SQLAlchemy engine, session maker, Base
│   │   └── security.py         # Password hashing (bcrypt) & session token utils
│   ├── models/                 # SQLAlchemy ORM declarative models
│   │   ├── base.py             # UUIDMixin, TimestampMixin
│   │   └── shared.py           # User, Session, Role, Org, Consent, Audit, File models
│   ├── modules/                # Domain-driven backend modules
│   │   ├── volunteer/          # Volunteer business logic & services
│   │   ├── ngo/                # NGO business logic & services
│   │   ├── csr/                # CSR business logic & services
│   │   └── shared/             # Shared platform services
│   │       ├── audit/          # Tamper-evident audit event logger
│   │       ├── auth/           # Session lifecycle & authentication
│   │       ├── consent/        # Informed consent manager
│   │       ├── notifications/  # Notification dispatchers
│   │       └── storage/        # Private document storage client
│   ├── schemas/                # Pydantic request/response validation schemas
│   │   └── health.py           # HealthCheckResponse schema
│   └── main.py                 # FastAPI application entrypoint & middleware
├── tests/                      # Pytest test suite
│   ├── conftest.py             # Shared fixtures (TestClient)
│   ├── test_config.py          # Settings validation tests
│   └── test_health.py          # API health check tests
├── alembic.ini                 # Alembic configuration
├── pyproject.toml              # Backend project configuration & Ruff/Pytest settings
├── requirements.txt            # Production dependencies
└── requirements-dev.txt        # Development dependencies
```

---

## 4. Architectural Rules Governing Folders

1. **No Circular Module Dependencies**: Modules in `modules/volunteer`, `modules/ngo`, and `modules/csr` may depend on `modules/shared` and `core`, but must never import across each other directly.
2. **Feature Isolation**: Product features under volunteer, ngo, or csr ecosystems must remain dormant or cleanly isolated until the corresponding feature specs are approved.
3. **No Direct Database Access in Endpoints**: Endpoints must delegate database operations to service layer functions or dependency-injected sessions within transactions.
4. **All Schema Changes Through Alembic**: No manual DDL executions permitted in staging or production environments.
