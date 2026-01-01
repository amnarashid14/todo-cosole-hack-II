#!/usr/bin/env python3
"""
Demo script to show how to use the Todo Application
"""

from src.cli.main import TodoCLI

def demo_todo_app():
    print("=== Todo Application Demo ===")
    print()

    # Create a CLI instance
    cli = TodoCLI()

    print("Available commands:")
    print("  add \"title\" \"description\"    - Add a new task (title max 80 chars, description max 500 chars)")
    print("  view                          - View all tasks")
    print("  update <id> \"new_title\" \"new_description\" - Update a task")
    print("  complete <id>                - Mark a task as complete")
    print("  incomplete <id>              - Mark a task as incomplete")
    print("  delete <id>                  - Delete a task")
    print("  help                          - Show this help message")
    print("  quit                          - Exit the application")
    print()

    print("Adding some sample tasks...")

    # Add tasks
    task1 = cli.service.add_task("Buy groceries", "Milk, bread, eggs, fruits")
    print(f"V Added task: '{task1.title}' with ID {task1.id}")

    task2 = cli.service.add_task("Finish project report", "Complete the quarterly project report for review")
    print(f"V Added task: '{task2.title}' with ID {task2.id}")

    task3 = cli.service.add_task("Call dentist", "Schedule appointment for next week")
    print(f"V Added task: '{task3.title}' with ID {task3.id}")
    print()

    # View all tasks
    print("Current tasks:")
    all_tasks = cli.service.get_all_tasks()
    for task in all_tasks:
        status_indicator = "X" if task.completed else "O"
        print(f"  [{status_indicator}] {task.id}. {task.title}")
        if task.description:
            print(f"      Description: {task.description}")
    print()

    # Mark a task as complete
    print("Marking task 1 as complete...")
    success = cli.service.mark_complete(1)
    if success:
        print("V Task 1 marked as complete")
    else:
        print("X Failed to mark task as complete")
    print()

    # Update a task
    print("Updating task 2...")
    success = cli.service.update_task(2, "Finish and submit project report", "Complete the quarterly project report and submit for review by Friday")
    if success:
        print("V Task 2 updated")
    else:
        print("X Failed to update task")
    print()

    # View tasks again to see changes
    print("Updated tasks:")
    all_tasks = cli.service.get_all_tasks()
    for task in all_tasks:
        status_indicator = "X" if task.completed else "O"
        print(f"  [{status_indicator}] {task.id}. {task.title}")
    print()

    # Delete a task
    print("Deleting task 3...")
    success = cli.service.delete_task(3)
    if success:
        print("V Task 3 deleted")
    else:
        print("X Failed to delete task")
    print()

    # Final view
    print("Final task list:")
    all_tasks = cli.service.get_all_tasks()
    if all_tasks:
        for task in all_tasks:
            status_indicator = "X" if task.completed else "O"
            print(f"  [{status_indicator}] {task.id}. {task.title}")
    else:
        print("  No tasks remaining")
    print()

    print("Demo completed! You can interact with the application using the commands shown above.")

if __name__ == "__main__":
    demo_todo_app()