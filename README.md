# HUMANE — Connected Three-Sided Social-Impact Platform

HUMANE is a connected, three-sided social-impact platform designed to unite:
1. **Volunteers** — grassroot community members contributing time, skills, and energy with dignity and privacy.
2. **NGOs & Implementing Organisations** — non-profits and community organizations operating free from predatory subscription paywalls.
3. **CSR Partners & Corporate Donors** — companies allocating grants, tracking verified social outcomes, and driving employee volunteering.

All three ecosystems operate on **one connected platform** with shared identity, multi-tenant boundaries, tamper-evident audit trails, and strict human-in-the-loop safeguards.

---

## Non-Negotiable Product Principles

- **Zero Paywall for Essential Access**: Small and grassroots NGOs are never excluded by artificial paywalls.
- **Privacy & Dignity**: Never sell volunteer or beneficiary personal data. Informed consent is explicit, granular, and revocable.
- **Tenant Isolation**: CSR partners never gain unrestricted access to internal NGO beneficiary or case records.
- **Human-in-the-Loop Safeguarding**: Verification and safeguarding decisions require human review. AI models assist but never make legal, financial, or safeguarding determinations.
- **Data Integrity**: No fabricated metrics, synthetic dashboards, or mock-only production workflows.

---

## Technology Stack

### Frontend (`frontend/`)
- **Framework**: Next.js 15+ (App Router) with React 19
- **Language**: TypeScript (Strict Mode enabled)
- **Styling**: Tailwind CSS with custom ecosystem tokens (Volunteer, NGO, CSR)
- **Component Architecture**: shadcn/ui (Radix UI primitives)
- **State & Caching**: TanStack Query v5
- **Form Validation**: React Hook Form + Zod
- **Testing**: Vitest + React Testing Library (Unit) and Playwright (E2E)

### Backend (`backend/`)
- **Framework**: FastAPI (Modular Monolith)
- **Language**: Python 3.11+
- **Validation**: Pydantic v2 & Pydantic Settings
- **ORM & Migrations**: SQLAlchemy 2.0 (Async + Sync) & Alembic
- **Testing**: Pytest + pytest-asyncio + HTTPX
- **Code Quality**: Ruff (linter and code formatter)

### Database & Security
- **Relational Store**: PostgreSQL 16+ (UUIDv4 primary keys, JSONB audit payloads, multi-tenant indexes)
- **Authentication**: Stateful server-side sessions with SHA-256 token hashing and secure HTTP-only cookies
- **Authorization**: Server-side RBAC and strict organisation tenant isolation
- **Sensitive Storage**: Private Azure Blob Storage with short-lived SAS tokens

---

## Project Structure

```
HUMANE/
├── .github/workflows/ci.yml    # GitHub Actions CI pipeline
├── backend/                    # Python FastAPI application
│   ├── alembic/                # Database migrations
│   ├── app/                    # Core, models, schemas, and modules
│   └── tests/                  # Pytest test suite
├── docs/                       # Architecture, database, security, and roadmap specs
│   ├── architecture/
│   ├── database/
│   ├── implementation/
│   ├── reference/
│   └── security/
├── frontend/                   # Next.js 15 App Router frontend
│   ├── e2e/                    # Playwright end-to-end tests
│   └── src/                    # App router, components, and feature modules
├── infrastructure/             # Cloud deployment configurations (Azure Container Apps)
├── scripts/                    # Development scripts
├── .env.example                # Configuration template (placeholders only)
└── .gitignore                  # Source control ignore rules
```

---

## Local Development Setup

No Docker installation is required for local development.

### Prerequisites
- **Node.js**: v20+ (Node v24 supported)
- **Python**: v3.11+
- **PostgreSQL**: v14+ (or local postgres instance)

---

### 1. Environment Configuration

Copy the example environment file to `.env`:

```bash
cp .env.example .env
```

*(Edit `.env` to configure your local PostgreSQL connection string and secure session secret).*

---

### 2. Backend Setup

From the repository root:

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows (PowerShell):
.venv\Scripts\Activate.ps1
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements-dev.txt

# Run database migrations (ensures PostgreSQL is reachable)
alembic upgrade head

# Run tests
pytest

# Run linter
ruff check .

# Start development API server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The backend API will be available at `http://localhost:8000`.
- Health Check: `http://localhost:8000/api/v1/health`
- Interactive API Docs (Swagger): `http://localhost:8000/api/v1/docs`

---

### 3. Frontend Setup

From the repository root in a separate terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run type check
npm run type-check

# Run linter
npm run lint

# Run unit tests
npm test

# Build production bundle
npm run build

# Start Next.js development server
npm run dev
```

The frontend application will be available at `http://localhost:3000`.

---

## Running Verification Checks

### Backend Checks
```powershell
cd backend
.venv\Scripts\ruff check .
.venv\Scripts\pytest -v
```

### Frontend Checks
```powershell
cd frontend
npm run type-check
npm run lint
npm test
npm run build
```

---

## Documentation Index

- [Approved Technology Stack](docs/architecture/TECH_STACK.md)
- [System Architecture & Topologies](docs/architecture/SYSTEM_ARCHITECTURE.md)
- [Project Structure & Modular Boundaries](docs/architecture/PROJECT_STRUCTURE.md)
- [Security Baseline & Safeguards](docs/security/SECURITY_BASELINE.md)
- [Shared Domain Database Design](docs/database/SHARED_DOMAIN_DESIGN.md)
- [Implementation Sequence & Roadmap](docs/implementation/IMPLEMENTATION_ROADMAP.md)
- [Core Product Principles](docs/reference/README.md)
