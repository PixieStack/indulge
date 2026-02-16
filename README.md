# INDULGE - Premium Dating Platform API

A FastAPI backend for a premium dating platform with PostgreSQL database, email/SMS verification, and user matching system.

## Tech Stack

- **Backend**: Python 3.11+ / FastAPI
- **Database**: PostgreSQL (with SQLAlchemy async)
- **Migrations**: Alembic
- **Auth**: JWT (python-jose) + bcrypt
- **Email**: Resend
- **SMS**: Twilio Verify API

---

## Local Setup (Windows)

### Prerequisites

1. **Python 3.11+** - [Download](https://www.python.org/downloads/)
2. **PostgreSQL 14+** - [Download](https://www.postgresql.org/download/windows/)
3. **Git** - [Download](https://git-scm.com/download/win)

### Step-by-Step Setup

#### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <project-folder>
```

#### 2. Create Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate it (Windows Command Prompt)
venv\Scripts\activate

# OR for PowerShell
venv\Scripts\Activate.ps1

# OR for Git Bash
source venv/Scripts/activate
```

#### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

#### 4. Setup PostgreSQL Database

Open **pgAdmin** or use **psql** command line:

```sql
-- Create database
CREATE DATABASE indulge_db;

-- Create user (optional, you can use postgres user)
CREATE USER indulge_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE indulge_db TO indulge_user;
```

#### 5. Create Environment File

Create a `.env` file in the project root:

```bash
# Copy the example file
copy .env.example .env
```

Then edit `.env` with your credentials (see `.env.example` for all options).

#### 6. Run Database Migrations

```bash
# Initialize/upgrade database tables
alembic upgrade head
```

If you get migration errors or want to start fresh:

```bash
# Create initial migration (only if no migrations exist)
alembic revision --autogenerate -m "Initial migration"

# Apply migrations
alembic upgrade head
```

#### 7. Run the Server

```bash
# Development mode with auto-reload
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

The API will be available at: `http://localhost:8001`
API Documentation: `http://localhost:8001/docs`

---

## Environment Variables

Create a `.env` file with the following:

```env
# Database (Required)
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/indulge_db

# JWT Secret (Required - Change this!)
JWT_SECRET_KEY=your-super-secret-key-change-in-production

# CORS Origins (Optional)
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Email - Resend (Optional - for email verification)
RESEND_API_KEY=re_xxxxxxxxxxxx
SENDER_EMAIL=noreply@yourdomain.com

# SMS - Twilio (Optional - for phone verification)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_VERIFY_SERVICE_SID=VAxxxxxxxxxxxxxxxx
```

---

## API Endpoints

### Auth
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Verification
- `POST /api/verification/send-otp` - Send OTP (email/phone)
- `POST /api/verification/verify-otp` - Verify OTP
- `POST /api/verification/face` - Face verification
- `POST /api/verification/payment` - Payment verification

### Profile
- `GET /api/profile/me` - Get current user profile
- `PUT /api/profile/me` - Update profile
- `POST /api/profile/upload-media` - Upload media

### Discovery
- `GET /api/discovery/feed` - Get discovery feed
- `POST /api/discovery/like` - Like a profile
- `POST /api/discovery/pass` - Pass on a profile

### Matches & Messages
- `GET /api/matches` - Get all matches
- `GET /api/messages/{match_id}` - Get messages for a match
- `POST /api/messages` - Send a message

### Subscription
- `POST /api/subscription/subscribe` - Subscribe to premium

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Get platform stats

---

## Testing the API

### Using curl (Windows PowerShell)

```powershell
# Health check
curl http://localhost:8001/docs

# Sign up
curl -X POST http://localhost:8001/api/auth/signup `
  -H "Content-Type: application/json" `
  -d '{"email":"test@example.com","phone":"+1234567890","password":"password123","role":"baby","first_name":"Test"}'

# Login
curl -X POST http://localhost:8001/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"test@example.com","password":"password123"}'
```

### Using the Swagger UI

Visit `http://localhost:8001/docs` for interactive API documentation.

---

## Troubleshooting

### Common Issues

1. **PostgreSQL connection error**
   - Ensure PostgreSQL service is running
   - Verify credentials in `.env`
   - Check if database exists

2. **Module not found errors**
   - Ensure virtual environment is activated
   - Run `pip install -r requirements.txt` again

3. **Alembic migration errors**
   - Delete `alembic/versions/*` files
   - Run `alembic revision --autogenerate -m "init"`
   - Run `alembic upgrade head`

4. **Port already in use**
   - Change port: `uvicorn server:app --port 8002`
   - Or kill the process using the port

---

## Project Structure

```
├── alembic/              # Database migrations
│   ├── versions/         # Migration files
│   └── env.py           # Alembic configuration
├── models/              # Pydantic models
├── utils/               # Utility functions
├── server.py            # Main FastAPI application
├── database.py          # Database configuration
├── models_pg.py         # SQLAlchemy ORM models
├── requirements.txt     # Python dependencies
├── alembic.ini          # Alembic settings
├── .env                 # Environment variables (create this)
└── README.md            # This file
```

---

## License

MIT
