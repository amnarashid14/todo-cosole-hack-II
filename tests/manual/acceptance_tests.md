# Manual Acceptance Tests for Todo Application

## Test 1: Add Task
- **Objective**: Verify that users can add tasks with title and description
- **Steps**:
  1. Start the application
  2. Execute `add "Buy groceries" "Milk, bread, eggs"`
  3. Verify task is added with unique ID and incomplete status
- **Expected Result**: Task appears in the task list with unique ID and default incomplete status

## Test 2: View All Tasks
- **Objective**: Verify that users can view all tasks
- **Steps**:
  1. Add a task if none exist
  2. Execute `view`
  3. Verify all tasks are displayed with ID, title, description, and completion status
- **Expected Result**: All tasks are displayed with their ID, title, description, and completion status

## Test 3: Update Task
- **Objective**: Verify that users can update task details by ID
- **Steps**:
  1. Add a task
  2. Execute `update 1 "Updated title" "Updated description"`
  3. Verify task details are updated
- **Expected Result**: Task title and description are updated successfully

## Test 4: Mark Complete/Incomplete
- **Objective**: Verify that users can mark tasks as complete/incomplete by ID
- **Steps**:
  1. Add a task
  2. Execute `complete 1`
  3. Execute `view` to confirm status changed
  4. Execute `incomplete 1`
  5. Execute `view` to confirm status changed back
- **Expected Result**: Task status updates correctly when marked complete/incomplete

## Test 5: Delete Task
- **Objective**: Verify that users can delete tasks by ID
- **Steps**:
  1. Add a task
  2. Execute `delete 1`
  3. Execute `view` to confirm task is removed
- **Expected Result**: Task is removed from the system and no longer appears in the list

## Test 6: Error Handling
- **Objective**: Verify proper error messages for invalid operations
- **Steps**:
  1. Execute `complete 999` (non-existent ID)
  2. Execute `update 999 "new title" "new desc"`
  3. Execute `delete 999`
- **Expected Result**: Appropriate error messages are displayed for invalid task IDs

## Test 7: Input Validation
- **Objective**: Verify validation for title/description length and content
- **Steps**:
  1. Try to add a task with title longer than 80 characters
  2. Try to add a task with description longer than 500 characters
  3. Try to add a task with empty title
- **Expected Result**: Appropriate validation errors are displayed

## Test 8: Help Command
- **Objective**: Verify help command displays available commands
- **Steps**:
  1. Execute `help`
- **Expected Result**: List of available commands is displayed

## Test 9: Quit Command
- **Objective**: Verify quit command exits the application
- **Steps**:
  1. Execute `quit`
- **Expected Result**: Application exits gracefully