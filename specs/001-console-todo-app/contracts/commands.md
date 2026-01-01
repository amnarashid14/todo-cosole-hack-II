# API Contracts: In-Memory Python Console Todo Application

## Command Interface Specifications

### Add Task Command
- **Command**: `add "title" "description"`
- **Input**: Title (string, max 80 chars), Description (string, max 500 chars)
- **Output**: Success message with task ID or error message (both user-friendly and technical details)
- **Behavior**: Creates a new task with unique ID and incomplete status; validates title length and non-empty requirement

### View Tasks Command
- **Command**: `view`
- **Input**: None
- **Output**: List of all tasks with ID, title, description, and completion status ([✓] for complete, [○] for incomplete)
- **Behavior**: Displays all tasks in the system with structured formatting

### Update Task Command
- **Command**: `update <id> "new_title" "new_description"`
- **Input**: Task ID (integer), new title (string, max 80 chars), new description (string, max 500 chars)
- **Output**: Success message or error message (both user-friendly and technical details)
- **Behavior**: Updates the title and description of the specified task; validates title length and non-empty requirement

### Mark Complete Command
- **Command**: `complete <id>`
- **Input**: Task ID (integer)
- **Output**: Success message or error message (both user-friendly and technical details)
- **Behavior**: Marks the specified task as complete

### Mark Incomplete Command
- **Command**: `incomplete <id>`
- **Input**: Task ID (integer)
- **Output**: Success message or error message (both user-friendly and technical details)
- **Behavior**: Marks the specified task as incomplete

### Delete Task Command
- **Command**: `delete <id>`
- **Input**: Task ID (integer)
- **Output**: Success message or error message (both user-friendly and technical details)
- **Behavior**: Removes the specified task from the system

### Help Command
- **Command**: `help`
- **Input**: None
- **Output**: List of available commands with usage examples
- **Behavior**: Displays help information for all available commands

### Quit Command
- **Command**: `quit`
- **Input**: None
- **Output**: Exit confirmation
- **Behavior**: Exits the persistent command loop application