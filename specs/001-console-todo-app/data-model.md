# Data Model: In-Memory Python Console Todo Application

## Entity: Task

**Description**: A todo item representing a user task with unique ID, title, description, and completion status

**Fields**:
- `id`: Integer - Unique identifier for the task, auto-incremented
- `title`: String (max 80 characters) - Title of the task (required, not empty or whitespace-only)
- `description`: String (max 500 characters) - Detailed description of the task (optional)
- `completed`: Boolean - Completion status of the task (default: False)

**Validation Rules**:
- `id` must be unique within the application session
- `title` must not be empty or whitespace-only and must be 80 characters or less
- `description` must be 500 characters or less
- `completed` must be a boolean value

**State Transitions**:
- `completed = False` → `completed = True` (when marking task as complete)
- `completed = True` → `completed = False` (when marking task as incomplete)

## Entity: TodoList

**Description**: Container for all tasks in the application session

**Fields**:
- `tasks`: Dictionary - Collection of Task objects keyed by ID
- `next_id`: Integer - Next available ID for new tasks (resets to 1 on application restart)

**Validation Rules**:
- All task IDs in the collection must be unique
- No duplicate task IDs allowed
- Task titles must be 80 characters or less
- Task descriptions must be 500 characters or less