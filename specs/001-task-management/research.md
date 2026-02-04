# Research: Secure User-Scoped Task Management REST API

## Phase 0: Technical Research & Decision Log

### Decision 1: JWT Verification Approach and Library Choice

**Decision**: Use `python-jose[cryptography]` with `jose` for JWT handling

**Rationale**:
- Well-maintained library specifically designed for JWT handling in Python
- Good integration with FastAPI ecosystem
- Supports RS256 and HS256 algorithms needed for secure authentication
- Has async support which aligns with FastAPI's async nature
- Better security track record compared to `PyJWT` alone

**Alternatives considered**:
- `PyJWT`: Simpler but requires additional crypto libraries
- `authlib`: More comprehensive but overkill for this use case
- `fastapi-jwt-auth`: Framework-specific solution, less flexible

### Decision 2: SQLModel Session and Transaction Handling

**Decision**: Use FastAPI dependency system with yield-based context managers for database sessions

**Rationale**:
- FastAPI's dependency injection system is perfect for managing DB sessions
- Yield-based approach ensures proper cleanup of sessions
- Automatic session management per request lifecycle
- Follows FastAPI best practices for database connections
- Ensures transactions are properly closed even if errors occur

**Code pattern**:
```python
async def get_session() -> AsyncSession:
    async with async_session() as session:
        yield session
```

### Decision 3: Authorization Strategy for Task Ownership Checks

**Decision**: Create reusable FastAPI dependency that extracts user_id from JWT and verifies task ownership in database

**Rationale**:
- Centralizes authorization logic to prevent code duplication
- Ensures all endpoints consistently check ownership
- Separates authentication (who you are) from authorization (what you can access)
- Allows for easy testing and maintenance
- Prevents security bypasses by enforcing checks at the route level

**Pattern**:
- Authentication dependency extracts user_id from JWT
- Ownership verification in route handlers using user_id from JWT vs. task's user_id in DB

### Decision 4: Error Handling Strategy (401 vs 403)

**Decision**:
- 401 Unauthorized for missing/invalid/expired JWT tokens
- 403 Forbidden for valid JWT but unauthorized access to resources owned by others

**Rationale**:
- Follows HTTP standard conventions correctly
- 401 indicates authentication failure (can't identify user)
- 403 indicates authorization failure (user identified but not authorized)
- Clear distinction helps API consumers understand error types
- Aligns with REST API best practices

### Decision 5: Timestamp Generation and Update Mechanism

**Decision**: Use SQLModel's Field with server_default and onupdate for automatic timestamps

**Rationale**:
- Leverages database-level timestamp generation for consistency
- Prevents client-side manipulation of timestamps
- Reduces application logic complexity
- Handles updates automatically when records are modified
- Maintains data integrity regardless of client behavior

**Implementation**:
```python
from sqlalchemy import func
from sqlmodel import Field

created_at: datetime = Field(default_factory=datetime.utcnow)
updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": func.now()})
```

### Decision 6: Environment Configuration Management

**Decision**: Use Pydantic Settings for environment variable management

**Rationale**:
- Integrates well with FastAPI ecosystem
- Provides validation for environment variables
- Supports type conversion and validation
- Handles sensitive data like secrets properly
- Follows modern Python configuration patterns

### Decision 7: API Endpoint Organization

**Decision**: Organize under `/api/v1/tasks` to allow for future versioning and maintain clean URL structure

**Rationale**:
- Follows REST API best practices
- Allows for versioning without breaking changes
- Maintains consistency with industry standards
- Supports potential expansion to other API resources
- Keeps API endpoints organized and discoverable

### Decision 8: PostgreSQL Driver Selection

**Decision**: Use asyncpg as the PostgreSQL database driver instead of psycopg2-binary

**Rationale**:
- asyncpg is a pure Python asyncio PostgreSQL client library
- Better compatibility with Windows development environments
- Native async support that integrates seamlessly with FastAPI and SQLModel
- Eliminates compilation issues often encountered with psycopg2-binary on Windows
- High-performance, pure Python implementation without C dependencies
- Better integration with the async/await paradigm of the application

**Alternatives considered**:
- psycopg2-binary: Traditional choice but causes compilation issues on Windows
- aiopg: Built on psycopg2 which has the same underlying issues

### Decision 9: Package Management

**Decision**: Use uv package manager for dependency management and installation

**Rationale**:
- uv is a modern, fast Python package installer and resolver
- Significantly faster than pip for dependency resolution and installation
- Provides better security features and more reliable dependency resolution
- Becoming the preferred package manager for Python projects
- Supports all standard Python packaging requirements
- Compatible with standard requirements.txt format