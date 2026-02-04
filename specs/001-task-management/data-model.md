# Data Model: Secure User-Scoped Task Management REST API

## Entity Definitions

### Task Entity

**Core Attributes**:
- `id`: Integer (Primary Key, auto-incrementing)
- `user_id`: String (Foreign Key reference to user from JWT, indexed)
- `title`: String (Required, auto-generated if not provided, max 255 chars)
- `description`: String (Optional, max 500 chars)
- `completed`: Boolean (Default: False)
- `deleted`: Boolean (Default: False, for soft deletes)
- `created_at`: DateTime (Auto-populated on creation)
- `updated_at`: DateTime (Auto-populated on creation and updates)

**Indexes**:
- Primary Key: `id`
- Foreign Key Index: `user_id` (critical for user isolation queries)
- Status Index: `completed` (for filtering completed/incomplete tasks)
- Soft Delete Index: `deleted` (for excluding deleted records by default)

**Validation Rules**:
- `title`: Required, max 255 characters
- `description`: Optional, max 500 characters
- `completed`: Boolean, default False
- `deleted`: Boolean, default False (acts as soft delete flag)

**Relationships**:
- Many Tasks belong to One User (via user_id from JWT)

## Database Schema

```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_tasks_deleted ON tasks(deleted);
```

## State Transitions

### Task Lifecycle States
- **Active**: Default state when created (`deleted = False`)
- **Completed**: When task completion is toggled (`completed = True`)
- **Incomplete**: When completed task is toggled back (`completed = False`)
- **Deleted**: When soft-deleted (`deleted = True`)

### Valid Transitions
- Active → Completed (via PATCH /api/tasks/{id}/complete)
- Active → Deleted (via DELETE /api/tasks/{id})
- Completed → Incomplete (via PATCH /api/tasks/{id}/complete)
- Incomplete → Completed (via PATCH /api/tasks/{id}/complete)
- Any state → Deleted (via DELETE /api/tasks/{id})

## SQLModel Definition

```python
from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel
from sqlalchemy import Column, DateTime, text

class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=500)
    completed: bool = Field(default=False)

class Task(TaskBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True, nullable=False)  # From JWT
    deleted: bool = Field(default=False, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        sa_column_kwargs={"server_default": text("CURRENT_TIMESTAMP"), "onupdate": text("CURRENT_TIMESTAMP")}
    )
```

## API Schema Models

### Request/Response Schemas

```python
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Create Task
class TaskCreate(TaskBase):
    pass  # Inherits from TaskBase

# Read Task (response)
class TaskRead(TaskBase):
    id: int
    user_id: str
    deleted: bool
    created_at: datetime
    updated_at: datetime

# Update Task
class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None

# Toggle Completion
class TaskToggleComplete(BaseModel):
    completed: bool

# Response for completion toggle
class TaskCompletionToggle(TaskRead):
    pass
```

## Query Patterns

### Common Queries
1. **Get user's tasks**: `SELECT * FROM tasks WHERE user_id = ? AND deleted = FALSE ORDER BY created_at DESC`
2. **Get specific task**: `SELECT * FROM tasks WHERE id = ? AND user_id = ? AND deleted = FALSE`
3. **Update task**: `UPDATE tasks SET title = ?, description = ?, completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?`
4. **Soft delete**: `UPDATE tasks SET deleted = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?`
5. **Toggle completion**: `UPDATE tasks SET completed = NOT completed, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?`

## Development Tools

### Database Driver
- **asyncpg**: Pure Python asyncio PostgreSQL client library for better Windows compatibility and native async support

### Package Management
- **uv**: Modern Python package manager for fast dependency resolution and installation
- **Dependencies**: Managed through requirements.txt compatible with uv