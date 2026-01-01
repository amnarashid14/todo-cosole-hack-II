# In-Memory Python Console Todo Application

A simple command-line todo application that allows users to manage tasks via a persistent command-line interface (REPL-style). All data is stored in memory only during the application session.

## Features

- Add tasks with title and description (title max 80 chars, description max 500 chars)
- View all tasks with unique IDs and completion status
- Update task title and description by ID
- Mark tasks as complete or incomplete
- Delete tasks by ID
- Persistent command loop interface

## Requirements

- Python 3.13+

## Installation

1. Clone the repository
2. Navigate to the project directory

## Usage

**Important**: Run the application from the project root directory (where the `src` folder is located):

```bash
python src/cli/main.py
```

Or run it as a module:

```bash
python -m src.cli.main
```

### Available Commands

- `add "title" "description"` - Add a new task
- `view` - View all tasks
- `update <id> "new_title" "new_description"` - Update a task
- `complete <id>` - Mark a task as complete
- `incomplete <id>` - Mark a task as incomplete
- `delete <id>` - Delete a task
- `help` - Show available commands
- `quit` - Exit the application

### Example Workflow

1. Add a task: `add "Buy groceries" "Milk, bread, eggs"`
2. View tasks: `view`
3. Mark complete: `complete 1`
4. Update task: `update 1 "Buy groceries" "Milk, bread, eggs, fruit"`
5. Delete task: `delete 1`

## Architecture

The application follows a three-layer architecture:

- **Models**: Data structures (Task model)
- **Services**: Business logic (TodoService)
- **CLI**: User interface (main.py)

## Constraints

- In-memory storage only (data is lost when the application exits)
- Task titles are limited to 80 characters
- Task descriptions are limited to 500 characters
- Task IDs reset on application restart