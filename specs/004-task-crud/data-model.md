# Data Model: Frontend Task CRUD and State Management

## Overview
This document defines the data structures and entities for the frontend task CRUD operations and state management feature.

## Key Entities

### 1. Task
**Description**: Represents a user's work item
**Attributes**:
- id: string (unique identifier for the task)
- title: string (required title of the task)
- description?: string (optional detailed description)
- completed: boolean (completion status)
- createdAt: Date (timestamp when task was created)
- updatedAt: Date (timestamp when task was last updated)
- userId: string (foreign key to associate task with user)

**Validation Rules**:
- Title must be at least 1 character long
- Description, if provided, must be less than 1000 characters
- Completed must be a boolean value
- createdAt and updatedAt must be valid ISO date strings

### 2. TaskList
**Description**: Collection of tasks for a specific user
**Attributes**:
- tasks: Task[] (array of Task objects)
- totalCount: number (total number of tasks)
- filteredCount: number (number of tasks after filtering)

**Validation Rules**:
- Must contain only valid Task objects
- totalCount must match the length of tasks array
- All tasks must belong to the same user

### 3. TaskOperation
**Description**: Represents a task manipulation operation
**Attributes**:
- type: "CREATE" | "UPDATE" | "DELETE" | "TOGGLE_COMPLETE" (operation type)
- taskId?: string (identifier for the task being operated on)
- payload?: any (data for the operation)
- status: "PENDING" | "SUCCESS" | "ERROR" (operation status)
- error?: string (error message if operation failed)

### 4. TaskState
**Description**: Current state of tasks in the UI
**Attributes**:
- tasks: Task[] (current list of tasks)
- loading: boolean (indicates if tasks are being loaded)
- error?: string (error message if operation failed)
- selectedTaskId?: string (currently selected task for editing)
- operation: TaskOperation (current operation being performed)

## State Transitions

### Task State
- **CREATED** → **PENDING_SAVE** (when creating new task)
- **PENDING_SAVE** → **SAVED** (on successful API response)
- **PENDING_SAVE** → **ERROR** (on API failure)
- **SAVED** → **PENDING_UPDATE** (when updating task)
- **PENDING_UPDATE** → **SAVED** (on successful update)
- **PENDING_UPDATE** → **ERROR** (on update failure)
- **SAVED** → **PENDING_DELETE** (when deleting task)
- **PENDING_DELETE** → **DELETED** (on successful deletion)
- **PENDING_DELETE** → **ERROR** (on deletion failure)

### Task Completion State
- **INCOMPLETE** → **PENDING_TOGGLE** (when toggling completion)
- **PENDING_TOGGLE** → **COMPLETED** (on successful completion)
- **PENDING_TOGGLE** → **IN_COMPLETE** (on successful un-completion)
- **PENDING_TOGGLE** → **ERROR** (on toggle failure - reverts to previous state)

## Relationships
- User has many Tasks (one-to-many relationship)
- TaskOperation affects one Task
- TaskState contains many Tasks

## Constraints
- Tasks must be associated with a valid user
- Task titles must be unique within a user's task list
- Only the owner of a task can modify it
- Tasks must not be modified directly; all changes must go through operations