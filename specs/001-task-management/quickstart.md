# Quickstart Guide: Secure User-Scoped Task Management API

## Prerequisites

- Python 3.11+
- PostgreSQL (or Neon Postgres connection)
- pip package manager

## Setup Instructions

### 1. Clone and Navigate to Backend Directory
```bash
# If using a new backend directory
mkdir -p backend
cd backend
```

### 2. Create Virtual Environment and Install Dependencies
```bash
# Install uv if not already installed
pip install uv

# Create virtual environment and install dependencies using uv
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install -r requirements.txt
```

### 3. Environment Configuration
Create a `.env` file in the backend root with the following variables:

```env
DATABASE_URL=postgresql+asyncpg://username:password@localhost:5432/taskdb
BETTER_AUTH_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
```

### 4. Initialize Database Tables
```bash
# Run the database initialization script
python -c "
import asyncio
from src.config.database import create_db_and_tables

asyncio.run(create_db_and_tables())
"
```

### 5. Run the Application
```bash
uvicorn src.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000` with interactive documentation at `http://localhost:8000/docs`.

## API Usage Examples

### 1. Authentication
All API calls require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### 2. Create a Task
```bash
curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "My First Task", "description": "A sample task"}'
```

### 3. List User's Tasks
```bash
curl -X GET http://localhost:8000/api/tasks \
  -H "Authorization: Bearer <your-jwt-token>"
```

### 4. Update a Task
```bash
curl -X PUT http://localhost:8000/api/tasks/1 \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Task Title", "completed": true}'
```

### 5. Toggle Task Completion
```bash
curl -X PATCH http://localhost:8000/api/tasks/1/complete \
  -H "Authorization: Bearer <your-jwt-token>"
```

### 6. Delete a Task
```bash
curl -X DELETE http://localhost:8000/api/tasks/1 \
  -H "Authorization: Bearer <your-jwt-token>"
```

## Key Security Features

1. **User Isolation**: Users can only access their own tasks
2. **JWT Authentication**: All endpoints require valid JWT tokens
3. **Automatic User Assignment**: Task user_id is automatically set from JWT
4. **Soft Deletes**: Tasks are marked as deleted rather than permanently removed
5. **Input Validation**: All inputs are validated according to API schemas

## Development Workflow

1. **Code Changes**: Modify files in the `src/` directory
2. **Testing**: Run tests with `pytest`
3. **Database Migrations**: Use Alembic for schema changes
4. **API Documentation**: Automatically generated with Swagger UI at `/docs`

## Troubleshooting

- **401 Errors**: Verify JWT token is valid and properly formatted
- **403 Errors**: Check that the task belongs to the authenticated user
- **Database Connection Issues**: Verify DATABASE_URL is correct in `.env`
- **Missing Dependencies**: Run `pip install -r requirements.txt` again