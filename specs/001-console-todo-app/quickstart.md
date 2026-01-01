# Quickstart: In-Memory Python Console Todo Application

## Prerequisites

- Python 3.13+ installed
- UV package manager (optional, for dependency management)

## Setup

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies (if any):
   ```bash
   uv sync  # or pip install -r requirements.txt
   ```

## Running the Application

```bash
python src/cli/main.py
```

## Basic Usage

### Available Commands:
- `add "title" "description"` - Add a new task (title max 80 chars, description max 500 chars)
- `view` - View all tasks
- `update <id> "new_title" "new_description"` - Update a task
- `complete <id>` - Mark a task as complete
- `incomplete <id>` - Mark a task as incomplete
- `delete <id>` - Delete a task
- `help` - Show available commands
- `quit` - Exit the application

### Example Workflow:
1. Add a task: `add "Buy groceries" "Milk, bread, eggs"`
2. View tasks: `view`
3. Mark complete: `complete 1`
4. Update task: `update 1 "Buy groceries" "Milk, bread, eggs, fruit"`
5. Delete task: `delete 1`

## Development

### Project Structure
- `src/models/task.py` - Task data model with validation for title/description length
- `src/services/todo_service.py` - Business logic for task operations with in-memory storage
- `src/cli/main.py` - Persistent command-line interface (REPL-style)

### Testing
Manual validation using the acceptance criteria from the specification:
- Verify add task creates a new in-memory entry
- Verify view lists all tasks with correct ID and status
- Verify update modifies the correct task by ID
- Verify delete removes the correct task by ID
- Verify mark complete/incomplete updates task status accurately
- Verify task IDs reset on application restart
- Verify proper error handling with both user-friendly and technical details