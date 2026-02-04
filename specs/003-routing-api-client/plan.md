# Implementation Plan: Frontend Routing and API Client Integration

**Branch**: `003-routing-api-client` | **Date**: 2026-01-16 | **Spec**: [specs/003-routing-api-client/spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-routing-api-client/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implementation of frontend routing protection and centralized API client for the Next.js application. The solution includes:
- Next.js middleware to enforce route access rules based on authentication state
- Centralized API client that automatically handles JWT token inclusion
- Proper error handling for authentication failures and other API errors
- Consistent redirect behavior for both authenticated and unauthenticated users

## Technical Context

**Language/Version**: TypeScript 5.0+ with React 18 and Next.js 14
**Primary Dependencies**: better-auth, Next.js App Router, React Server Components
**Storage**: Browser cookies for session management
**Testing**: Jest/React Testing Library for frontend components and API client
**Target Platform**: Web application (SSR/Client-side rendering)
**Project Type**: Web application with frontend/backend separation
**Performance Goals**: Sub-second redirect responses, minimal API call overhead (<50ms)
**Constraints**: Must work with existing better-auth authentication system, no external dependencies
**Scale/Scope**: Single tenant application, <1000 concurrent users

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Initial Check (Pre-Research)
- ✅ Spec-Driven Development: Implementation follows approved specification requirements
- ✅ Agentic Workflow Transparency: Planning and execution documented in this file
- ✅ No Manual Coding: Implementation will be generated via Claude Code
- ✅ Clean, Readable, and Maintainable Code: Will follow TypeScript/React best practices
- ✅ Deterministic Behavior: Route protection and API calls will behave predictably

### Post-Design Check (Post-Phase 1)
- ✅ Spec-Driven Development: All design artifacts trace back to specification requirements
- ✅ Agentic Workflow Transparency: All design decisions documented in research.md
- ✅ No Manual Coding: Design enables automated implementation
- ✅ Clean, Readable, and Maintainable Code: Architecture follows Next.js/React best practices
- ✅ Deterministic Behavior: Middleware and API client provide consistent behavior

## Project Structure

### Documentation (this feature)

```text
specs/003-routing-api-client/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
frontend/
├── app/
│   ├── middleware.ts        # Route protection middleware
│   ├── layout.tsx
│   ├── page.tsx             # Home page (public)
│   ├── login/
│   │   └── page.tsx         # Login page (public)
│   ├── register/
│   │   └── page.tsx         # Register page (public)
│   └── tasks/
│       └── page.tsx         # Tasks page (protected)
├── lib/
│   └── api.ts               # Centralized API client
└── components/
    └── auth/                # Authentication-related components

backend/
├── main.py                  # FastAPI backend (unchanged)
└── ...

src/
└── (existing console app - unchanged)

```

**Structure Decision**: Web application with frontend/backend separation. Frontend handles route protection via Next.js middleware and API client via centralized service at `/frontend/lib/api.ts`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | | |
