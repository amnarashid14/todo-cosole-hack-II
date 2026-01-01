#!/usr/bin/env python3
"""
Persistent command-line interface (REPL) for the todo application.
Provides a command loop that allows users to interact with the todo system.
"""

import re
import sys
import os
from typing import List, Optional

# Get the directory containing this file, then go up two levels to project root
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(os.path.dirname(current_dir))

# Add the project root to the Python path if not already there
if project_root not in sys.path:
    sys.path.insert(0, project_root)

# Import using the relative path approach
from src.services.todo_service import TodoService


class TodoCLI:
    """
    Command-line interface for the todo application.
    Implements a persistent command loop (REPL-style) interface.
    """

    def __init__(self):
        """Initialize the CLI with a TodoService instance."""
        self.service = TodoService()
        self.running = True

    def run(self):
        """Run the main command loop."""
        print("Welcome to the Todo Application!")
        print("Type 'help' for available commands or 'quit' to exit.")

        while self.running:
            try:
                # Get user input
                user_input = input("\ntodo> ").strip()

                if not user_input:
                    continue

                # Parse and execute the command
                self.execute_command(user_input)

            except KeyboardInterrupt:
                print("\nUse 'quit' to exit the application.")
            except EOFError:
                print("\nGoodbye!")
                break

    def execute_command(self, user_input: str):
        """Parse and execute a command from user input."""
        # Split the input into command and arguments
        parts = user_input.split(' ', 1)
        command = parts[0].lower()

        # Get arguments if they exist
        args = parts[1] if len(parts) > 1 else ""

        # Execute the appropriate command
        if command == 'add':
            self.handle_add(args)
        elif command == 'view':
            self.handle_view()
        elif command == 'update':
            self.handle_update(args)
        elif command == 'complete':
            self.handle_complete(args)
        elif command == 'incomplete':
            self.handle_incomplete(args)
        elif command == 'delete':
            self.handle_delete(args)
        elif command == 'help':
            self.handle_help()
        elif command == 'quit':
            self.handle_quit()
        else:
            self.handle_unknown_command(command)

    def handle_add(self, args: str):
        """Handle the add command to create a new task."""
        # Parse title and description from arguments
        title, description = self._parse_title_description(args)

        if title is None:
            print("Error: Please provide a title. Usage: add \"title\" \"description\"")
            print("Technical: Missing title parameter for add command")
            return

        try:
            task = self.service.add_task(title, description or "")
            print(f"Task added successfully with ID {task.id}: {task.title}")
        except ValueError as e:
            print(f"Error: {str(e)}")
            print(f"Technical: ValueError occurred during task creation: {str(e)}")
        except Exception as e:
            print(f"Error: An unexpected error occurred - {str(e)}")
            print(f"Technical: Unexpected error during task creation: {str(e)}")

    def handle_view(self):
        """Handle the view command to display all tasks."""
        tasks = self.service.get_all_tasks()

        if not tasks:
            print("No tasks found.")
            return

        print("\nYour Tasks:")
        for task in tasks:
            status_indicator = "X" if task.completed else "O"
            print(f"[{status_indicator}] {task.id}. {task.title}")
            if task.description:
                print(f"      Description: {task.description}")
        print(f"\nTotal tasks: {len(tasks)}")

    def handle_update(self, args: str):
        """Handle the update command to modify an existing task."""
        # Parse task ID, new title, and new description
        task_id, new_title, new_description = self._parse_update_args(args)

        if task_id is None:
            print("Error: Invalid arguments. Usage: update <id> \"new_title\" \"new_description\"")
            return

        # Check if task exists before trying to update
        task_exists = self.service.get_task_by_id(task_id) is not None
        if not task_exists:
            print(f"Error: Task with ID {task_id} not found.")
            return

        success = self.service.update_task(task_id, new_title, new_description)

        if success:
            print(f"Task {task_id} updated successfully.")
        else:
            print(f"Error: Failed to update task {task_id}.")

    def handle_complete(self, args: str):
        """Handle the complete command to mark a task as complete."""
        task_id = self._parse_task_id(args)

        if task_id is None:
            print("Error: Invalid task ID. Usage: complete <id>")
            return

        # Check if task exists before trying to update
        task_exists = self.service.get_task_by_id(task_id) is not None
        if not task_exists:
            print(f"Error: Task with ID {task_id} not found.")
            return

        success = self.service.mark_complete(task_id)

        if success:
            print(f"Task {task_id} marked as complete.")
        else:
            print(f"Error: Failed to update task {task_id}.")

    def handle_incomplete(self, args: str):
        """Handle the incomplete command to mark a task as incomplete."""
        task_id = self._parse_task_id(args)

        if task_id is None:
            print("Error: Invalid task ID. Usage: incomplete <id>")
            return

        # Check if task exists before trying to update
        task_exists = self.service.get_task_by_id(task_id) is not None
        if not task_exists:
            print(f"Error: Task with ID {task_id} not found.")
            return

        success = self.service.mark_incomplete(task_id)

        if success:
            print(f"Task {task_id} marked as incomplete.")
        else:
            print(f"Error: Failed to update task {task_id}.")

    def handle_delete(self, args: str):
        """Handle the delete command to remove a task."""
        task_id = self._parse_task_id(args)

        if task_id is None:
            print("Error: Invalid task ID. Usage: delete <id>")
            return

        # Check if task exists before trying to delete
        task_exists = self.service.get_task_by_id(task_id) is not None
        if not task_exists:
            print(f"Error: Task with ID {task_id} not found.")
            return

        success = self.service.delete_task(task_id)

        if success:
            print(f"Task {task_id} deleted successfully.")
        else:
            print(f"Error: Failed to delete task {task_id}.")

    def handle_help(self):
        """Display help information for all available commands."""
        print("\nAvailable commands:")
        print("  add \"title\" \"description\"    - Add a new task (title max 80 chars, description max 500 chars)")
        print("  view                          - View all tasks")
        print("  update <id> \"new_title\" \"new_description\" - Update a task")
        print("  complete <id>                - Mark a task as complete")
        print("  incomplete <id>              - Mark a task as incomplete")
        print("  delete <id>                  - Delete a task")
        print("  help                          - Show this help message")
        print("  quit                          - Exit the application")

    def handle_quit(self):
        """Handle the quit command to exit the application."""
        print("Goodbye!")
        self.running = False

    def handle_unknown_command(self, command: str):
        """Handle unknown commands."""
        print(f"Error: Unknown command '{command}'. Type 'help' for available commands.")
        print(f"Technical: Command '{command}' not recognized by the system. Available commands: add, view, update, complete, incomplete, delete, help, quit")

    def _parse_title_description(self, args: str) -> tuple:
        """
        Parse title and description from command arguments.

        Args:
            args (str): The arguments string

        Returns:
            tuple: (title, description) or (None, None) if parsing fails
        """
        # Use regex to match quoted strings
        pattern = r'"([^"]*)"'
        matches = re.findall(pattern, args)

        if len(matches) == 0:
            return None, None
        elif len(matches) == 1:
            return matches[0], ""
        else:
            return matches[0], matches[1]

    def _parse_update_args(self, args: str) -> tuple:
        """
        Parse task ID, new title, and new description from update command arguments.

        Args:
            args (str): The arguments string

        Returns:
            tuple: (task_id, new_title, new_description) or (None, None, None) if parsing fails
        """
        # Split by space to get the ID first
        parts = args.split(' ', 1)
        if len(parts) < 2:
            return None, None, None

        try:
            task_id = int(parts[0])
        except ValueError:
            return None, None, None

        # Parse the remaining part for new title and description
        new_title, new_description = self._parse_title_description(parts[1])

        return task_id, new_title, new_description

    def _parse_task_id(self, args: str) -> Optional[int]:
        """
        Parse task ID from command arguments.

        Args:
            args (str): The arguments string

        Returns:
            Optional[int]: The task ID or None if parsing fails
        """
        try:
            return int(args.strip())
        except ValueError:
            return None


def main():
    """Main entry point for the application."""
    cli = TodoCLI()
    cli.run()


if __name__ == "__main__":
    main()