from typing import List, Optional
from src.models.task import Task


class TodoService:
    """
    Business logic for task operations with in-memory storage.
    Manages tasks in memory with auto-incrementing IDs that reset on application restart.
    """

    def __init__(self):
        """
        Initialize the TodoService with empty task storage and ID counter.
        """
        self.tasks = {}  # Dictionary to store tasks keyed by ID
        self.next_id = 1  # Next available ID for new tasks (resets to 1 on application restart)

    def add_task(self, title: str, description: str = "") -> Task:
        """
        Create a new task with unique ID and incomplete status.

        Args:
            title (str): Title of the task (required, not empty or whitespace-only, max 80 chars)
            description (str): Description of the task (optional, max 500 chars)

        Returns:
            Task: The newly created Task instance

        Raises:
            ValueError: If the title doesn't meet requirements
        """
        # Validate title before creating task (task constructor will also validate)
        self._validate_title_for_add(title)

        # Create new task with the next available ID
        new_task = Task(self.next_id, title, description, completed=False)
        self.tasks[self.next_id] = new_task

        # Increment ID for next task
        self.next_id += 1

        return new_task

    def _validate_title_for_add(self, title: str):
        """
        Validate title specifically for adding a task.

        Args:
            title (str): The title to validate

        Raises:
            ValueError: If the title is empty, whitespace-only, or exceeds character limit
        """
        if not title or not title.strip():
            raise ValueError("Task title cannot be empty or whitespace-only")

        if len(title) > 80:
            raise ValueError(f"Task title exceeds maximum length of 80 characters: {len(title)} characters provided")

    def get_all_tasks(self) -> List[Task]:
        """
        Return all tasks in the system.

        Returns:
            List[Task]: List of all Task instances
        """
        return list(self.tasks.values())

    def get_task_by_id(self, task_id: int) -> Optional[Task]:
        """
        Get a specific task by its ID.

        Args:
            task_id (int): The ID of the task to retrieve

        Returns:
            Optional[Task]: The Task instance if found, None otherwise
        """
        return self.tasks.get(task_id)

    def update_task(self, task_id: int, new_title: str = None, new_description: str = None) -> bool:
        """
        Update the title and description of an existing task by ID.

        Args:
            task_id (int): The ID of the task to update
            new_title (str, optional): New title for the task
            new_description (str, optional): New description for the task

        Returns:
            bool: True if the task was successfully updated, False otherwise
        """
        task = self.get_task_by_id(task_id)
        if not task:
            return False

        # Validate new title if provided
        if new_title is not None:
            self._validate_title_for_update(new_title)
            task.update_title(new_title)

        # Update description if provided
        if new_description is not None:
            task.update_description(new_description)

        return True

    def _validate_title_for_update(self, title: str):
        """
        Validate title specifically for updating a task.

        Args:
            title (str): The title to validate

        Raises:
            ValueError: If the title is empty, whitespace-only, or exceeds character limit
        """
        if not title or not title.strip():
            raise ValueError("Task title cannot be empty or whitespace-only")

        if len(title) > 80:
            raise ValueError(f"Task title exceeds maximum length of 80 characters: {len(title)} characters provided")

    def mark_complete(self, task_id: int) -> bool:
        """
        Mark a task as complete by its ID.

        Args:
            task_id (int): The ID of the task to mark as complete

        Returns:
            bool: True if the task was successfully marked as complete, False otherwise
        """
        task = self.get_task_by_id(task_id)
        if not task:
            return False

        task.mark_complete()
        return True

    def mark_incomplete(self, task_id: int) -> bool:
        """
        Mark a task as incomplete by its ID.

        Args:
            task_id (int): The ID of the task to mark as incomplete

        Returns:
            bool: True if the task was successfully marked as incomplete, False otherwise
        """
        task = self.get_task_by_id(task_id)
        if not task:
            return False

        task.mark_incomplete()
        return True

    def _validate_task_exists(self, task_id: int) -> bool:
        """
        Validate that a task exists before performing operations on it.

        Args:
            task_id (int): The ID of the task to validate

        Returns:
            bool: True if the task exists, False otherwise
        """
        return task_id in self.tasks

    def delete_task(self, task_id: int) -> bool:
        """
        Remove a task by its ID.

        Args:
            task_id (int): The ID of the task to delete

        Returns:
            bool: True if the task was successfully deleted, False otherwise
        """
        if task_id in self.tasks:
            del self.tasks[task_id]
            return True
        return False

    def reset(self):
        """
        Reset the service to initial state (for testing purposes).
        """
        self.tasks = {}
        self.next_id = 1