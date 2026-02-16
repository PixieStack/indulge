# INDULGE - Premium Dating Platform

A luxury dating platform with React frontend and FastAPI backend, featuring gold and black aesthetics.

## Tech Stack

- **Frontend**: React 18, Framer Motion, Lucide Icons
- **Backend**: Python 3.11+ / FastAPI
- **Database**: Supabase (PostgreSQL with SQLAlchemy async)
- **Auth**: JWT (python-jose) + bcrypt
- **Email**: Resend
- **SMS**: Twilio Verify API

---

## Quick Start (GitHub Codespaces / Linux)

### 1. Setup Environment File

Create `.env` file in root directory:
```bash
cat > .env << 'EOF'
DATABASE_URL=postgresql://postgres.gydfdxgttwgloyonntvh:YOUR_PASSWORD@aws-1-eu-central-1.pooler.supabase.com:5432/postgres
JWT_SECRET_KEY=your-secret-key-change-in-production
CORS_ORIGINS=*
EOF
```

### 2. Install & Run Backend

```bash
# Remove emergentintegrations if present (it's platform-specific)
sed -i '/emergentintegrations/d' requirements.txt

# Install dependencies
pip install -r requirements.txt

# Start backend server
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

### 3. Install & Run Frontend (in a new terminal)

```bash
cd frontend

# Install dependencies
npm install

# Start frontend
npm start
```

### Access the App

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **API Docs**: http://localhost:8001/docs

---

## Features

- Landing page with stunning gold/black design
- User registration (Sugar Baby / Sugar Daddy / Sugar Mommy)
- Login / Authentication
- Dashboard with stats
- Discovery/Swiping feed
- Matches list
- Real-time messaging
- Profile management
- Verification system

---

## Project Structure

```
├── frontend/               # React frontend
│   ├── src/
│   │   ├── pages/         # Landing, Login, Signup, Dashboard, etc.
│   │   ├── contexts/      # Auth context
│   │   └── index.css      # Global styles (gold/black theme)
│   └── package.json
├── server.py              # FastAPI backend
├── database.py            # Database config
├── models_pg.py           # SQLAlchemy models
├── requirements.txt       # Python dependencies
└── .env                   # Environment variables
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

### Using curl (Linux/Codespaces)

```bash
# Health check
curl http://localhost:8001/docs

# Sign up
curl -X POST http://localhost:8001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","phone":"+1234567890","password":"password123","role":"baby","first_name":"Test"}'

# Login
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Using the Swagger UI

Visit `http://localhost:8001/docs` for interactive API documentation.

---

## Troubleshooting

### Common Issues

1. **Supabase connection error**
   - Check DATABASE_URL in `.env`
   - Ensure password special characters are URL-encoded
   - Verify Supabase project is active

2. **Module not found errors**
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
