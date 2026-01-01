class Task:
    """
    A todo item representing a user task with unique ID, title, description, and completion status.
    """

    def __init__(self, task_id: int, title: str, description: str = "", completed: bool = False):
        """
        Initialize a Task instance.

        Args:
            task_id (int): Unique identifier for the task
            title (str): Title of the task (required, not empty or whitespace-only, max 80 chars)
            description (str): Detailed description of the task (optional, max 500 chars)
            completed (bool): Completion status of the task (default: False)
        """
        self.id = task_id
        self.title = self._validate_title(title)
        self.description = self._validate_description(description)
        self.completed = completed

    def _validate_title(self, title: str) -> str:
        """
        Validate the title according to requirements.

        Args:
            title (str): The title to validate

        Returns:
            str: The validated title

        Raises:
            ValueError: If the title is empty, whitespace-only, or exceeds 80 characters
        """
        if not title or not title.strip():
            raise ValueError("Task title cannot be empty or whitespace-only")

        if len(title) > 80:
            raise ValueError(f"Task title exceeds maximum length of 80 characters: {len(title)} characters provided")

        return title.strip()

    def _validate_description(self, description: str) -> str:
        """
        Validate the description according to requirements.

        Args:
            description (str): The description to validate

        Returns:
            str: The validated description

        Raises:
            ValueError: If the description exceeds 500 characters
        """
        if len(description) > 500:
            raise ValueError(f"Task description exceeds maximum length of 500 characters: {len(description)} characters provided")

        return description

    def mark_complete(self):
        """Mark the task as complete."""
        self.completed = True

    def mark_incomplete(self):
        """Mark the task as incomplete."""
        self.completed = False

    def update_title(self, new_title: str):
        """
        Update the task title after validation.

        Args:
            new_title (str): The new title for the task
        """
        self.title = self._validate_title(new_title)

    def update_description(self, new_description: str):
        """
        Update the task description after validation.

        Args:
            new_description (str): The new description for the task
        """
        self.description = self._validate_description(new_description)

    def to_dict(self) -> dict:
        """
        Convert the task to a dictionary representation.

        Returns:
            dict: Dictionary representation of the task
        """
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'completed': self.completed
        }

    def __str__(self) -> str:
        """
        String representation of the task for display purposes.

        Returns:
            str: Formatted string representation of the task
        """
        status_indicator = "X" if self.completed else "O"
        return f"[{status_indicator}] {self.id}. {self.title} - {self.description}"

    def __repr__(self) -> str:
        """
        Detailed string representation of the task.

        Returns:
            str: Detailed string representation of the task
        """
        return f"Task(id={self.id}, title='{self.title}', description='{self.description}', completed={self.completed})"