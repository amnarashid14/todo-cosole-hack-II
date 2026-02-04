# Data Model: Tasks Dashboard UI Components

## Component Entities

### User Entity
- **Entity Name**: User
- **Fields**:
  - firstName (string): User's first name for greeting display
  - name (string): Full name for display in navigation
  - email (string): Email address for display in navigation
- **Relationships**: N/A (standalone entity for UI display)
- **Validation Rules**: All fields required for display purposes

### TaskStatus Entity
- **Entity Name**: TaskStatus
- **Fields**:
  - type (enum: "Pending" | "Completed" | "InProgress"): Type of task status
  - title (string): Display title for the status card
  - count (number): Static count for UI display (placeholder)
  - colorClass (string): Tailwind CSS class for styling
- **Relationships**: N/A (standalone entity for UI display)
- **Validation Rules**: All fields required for proper card rendering

### Task Entity
- **Entity Name**: Task
- **Fields**:
  - name (string): Task name (required field)
  - description (string): Task description (optional field)
- **Relationships**: N/A (standalone entity for form validation)
- **Validation Rules**:
  - name: Required, minimum length of 1 character
  - description: Optional, maximum length as per UI constraints

## Component State Models

### TaskForm State
- **Model Name**: TaskFormState
- **Fields**:
  - taskName (string): Current value of task name input
  - taskDescription (string): Current value of task description textarea
  - errors (object): Validation errors for form fields
  - isSubmitting (boolean): Flag for form submission state
- **Validation Rules**: taskName required when submitting

### Navbar State
- **Model Name**: NavbarState
- **Fields**:
  - user (User): User information for display
  - isMobileMenuOpen (boolean): Flag for mobile menu visibility
- **Validation Rules**: user object required for proper display

## Component Prop Interfaces

### TaskNavbar Props
- **Interface Name**: TaskNavbarProps
- **Fields**:
  - userName (string): User's name to display
  - userEmail (string): User's email to display
  - onLogout (function): Callback for logout action
- **Validation Rules**: All props required for component functionality

### StatusCard Props
- **Interface Name**: StatusCardProps
- **Fields**:
  - title (string): Card title
  - count (number): Count to display
  - colorClass (string): CSS class for styling
  - onClick (function): Click handler for interactivity
- **Validation Rules**: All props required for proper card display

### AddTaskForm Props
- **Interface Name**: AddTaskFormProps
- **Fields**:
  - onSubmit (function): Callback for form submission
- **Validation Rules**: onSubmit callback required

## UI State Transitions

### Form Interaction States
- **Initial State**: Form fields empty, no errors
- **On Input**: Fields update with user input, errors cleared
- **On Submit**: Validation occurs, errors displayed if invalid, form cleared if valid
- **On Error**: Error messages displayed, focus on problematic fields

### Responsive States
- **Desktop**: Navigation bar horizontal, status cards in row
- **Mobile**: Navigation bar with hamburger menu, status cards stacked vertically
- **Transition**: Smooth responsive transition between states