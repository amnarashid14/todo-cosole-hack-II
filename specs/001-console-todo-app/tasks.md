---
description: "Task list template for feature implementation"
---

# Tasks: In-Memory Python Console Todo Application

**Input**: Design documents from `/specs/001-console-todo-app/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project structure per implementation plan
- [X] T002 [P] Create src directory structure: src/models/, src/services/, src/cli/
- [X] T003 [P] Create tests directory structure: tests/manual/

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Create Task model in src/models/task.py with ID, title (max 80 chars), description (max 500 chars), completed status
- [X] T005 Create TodoService in src/services/todo_service.py with in-memory storage and auto-incrementing IDs that reset on restart
- [X] T006 Create CLI interface in src/cli/main.py with persistent command loop (REPL-style) and basic command parsing

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Add New Tasks (Priority: P1) 🎯 MVP

**Goal**: Enable users to add new todo tasks to their list with a title and description for organization and tracking

**Independent Test**: User can run the application, enter a command to add a task with title and description, and verify the task appears in the task list with a unique ID and default incomplete status

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T007 [P] [US1] Manual test for add command in tests/manual/acceptance_tests.md

### Implementation for User Story 1

- [X] T008 [US1] Implement Task class with id, title (max 80 chars), description (max 500 chars), completed fields in src/models/task.py
- [X] T009 [US1] Implement validation in Task class to ensure title is not empty/whitespace and within character limits in src/models/task.py
- [X] T010 [US1] Implement add_task method in TodoService to create tasks with unique IDs and incomplete status in src/services/todo_service.py
- [X] T011 [US1] Implement validation in TodoService to ensure titles meet requirements before adding in src/services/todo_service.py
- [X] T012 [US1] Implement add command handler in CLI to parse title/description and call TodoService in src/cli/main.py
- [X] T013 [US1] Add auto-incrementing ID generation in TodoService that resets on application restart in src/services/todo_service.py

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - View All Tasks (Priority: P1)

**Goal**: Enable users to view all tasks in their todo list to understand their current responsibilities and track progress

**Independent Test**: User can run the application and execute a command to view all tasks, seeing a formatted list with unique IDs, titles, descriptions, and completion status

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T014 [P] [US2] Manual test for view command in tests/manual/acceptance_tests.md

### Implementation for User Story 2

- [X] T015 [US2] Implement get_all_tasks method in TodoService to return all tasks in src/services/todo_service.py
- [X] T016 [US2] Implement view command handler in CLI to display all tasks with ID, title, description, and status in src/cli/main.py
- [X] T017 [US2] Add proper formatting for task display including [✓] or [○] visual indicators for completion status in src/cli/main.py
- [X] T018 [US2] Add handling for empty task list scenario in src/cli/main.py

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Mark Tasks Complete/Incomplete (Priority: P2)

**Goal**: Enable users to update the completion status of tasks to track their progress and mark items as done

**Independent Test**: User can run the application, view existing tasks, execute a command to mark a specific task as complete/incomplete by ID, and verify the status updates

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T019 [P] [US3] Manual test for complete/incomplete commands in tests/manual/acceptance_tests.md

### Implementation for User Story 3

- [X] T020 [US3] Implement mark_complete and mark_incomplete methods in TodoService in src/services/todo_service.py
- [X] T021 [US3] Implement complete command handler in CLI to mark task as complete by ID in src/cli/main.py
- [X] T022 [US3] Implement incomplete command handler in CLI to mark task as incomplete by ID in src/cli/main.py
- [X] T023 [US3] Add validation to ensure task exists before updating status in src/services/todo_service.py

**Checkpoint**: At this point, User Stories 1, 2 AND 3 should all work independently

---

## Phase 6: User Story 4 - Update Task Details (Priority: P3)

**Goal**: Enable users to modify the title and description of existing tasks to keep information accurate and up-to-date

**Independent Test**: User can run the application, identify a task by ID, execute a command to update its title and/or description, and verify the changes persist

### Tests for User Story 4 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T024 [P] [US4] Manual test for update command in tests/manual/acceptance_tests.md

### Implementation for User Story 4

- [X] T025 [US4] Implement update_task method in TodoService to modify title and description by ID in src/services/todo_service.py
- [X] T026 [US4] Implement update command handler in CLI to parse ID, new title, and new description in src/cli/main.py
- [X] T027 [US4] Add validation to ensure title is not empty/whitespace and within character limits when updating in src/services/todo_service.py

**Checkpoint**: At this point, User Stories 1, 2, 3 AND 4 should all work independently

---

## Phase 7: User Story 5 - Delete Tasks (Priority: P3)

**Goal**: Enable users to remove completed or obsolete tasks from their list to maintain a clean and manageable todo list

**Independent Test**: User can run the application, identify a task by ID, execute a delete command, and verify the task is removed from the system

### Tests for User Story 5 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T028 [P] [US5] Manual test for delete command in tests/manual/acceptance_tests.md

### Implementation for User Story 5

- [X] T029 [US5] Implement delete_task method in TodoService to remove task by ID in src/services/todo_service.py
- [X] T030 [US5] Implement delete command handler in CLI to remove task by ID in src/cli/main.py
- [X] T031 [US5] Add validation to ensure task exists before deletion in src/services/todo_service.py

**Checkpoint**: All user stories should now be independently functional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T032 [P] Add error handling for invalid task IDs in all commands in src/services/todo_service.py
- [X] T033 [P] Add proper error messages with both user-friendly and technical details in src/cli/main.py
- [X] T034 [P] Add input validation for edge cases (very long titles/descriptions, empty titles) in src/models/task.py
- [X] T035 [P] Add help command to show available commands in src/cli/main.py
- [X] T036 [P] Add quit command to exit the application in src/cli/main.py
- [X] T037 [P] Documentation updates in README.md
- [X] T038 [P] Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable
- **User Story 4 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2/US3 but should be independently testable
- **User Story 5 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2/US3/US4 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all models for User Story 1 together:
Task: "Implement Task class with id, title (max 80 chars), description (max 500 chars), completed fields in src/models/task.py"
Task: "Implement validation in Task class to ensure title is not empty/whitespace and within character limits in src/models/task.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
   - Developer D: User Story 4
   - Developer E: User Story 5
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence