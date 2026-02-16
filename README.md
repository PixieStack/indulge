# INDULGE - Premium Sugar Dating Platform

A luxury dating platform with React frontend and FastAPI backend featuring a stunning gold/black futuristic design.

## Quick Start (GitHub Codespaces)

### 1. Create Environment File

```bash
cat > .env << 'EOF'
DATABASE_URL=postgresql://postgres.gydfdxgttwgloyonntvh:Tt%4019990423%28%23eden-minnie%21%29@aws-1-eu-central-1.pooler.supabase.com:5432/postgres
JWT_SECRET_KEY=indulge-secret-key-change-in-production-2024
CORS_ORIGINS=*
SUPABASE_URL=https://gydfdxgttwgloyonntvh.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5ZGZkeGd0dHdnbG95b25udHZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMTU5MTMsImV4cCI6MjA4Njc5MTkxM30.a0nCTUnkfFRrJBflIizg93uvEd0bTjLSOeaEFenLAR4
RESEND_API_KEY=re_iqfUpcRU_2TeNtBUpewantLPRWENzkfCr
SENDER_EMAIL=onboarding@resend.dev
EOF
```

### 2. Install & Run Backend (Terminal 1)

```bash
# Remove platform-specific package
sed -i '/emergentintegrations/d' requirements.txt

# Install dependencies
pip install -r requirements.txt

# Start backend
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

### 3. Install & Run Frontend (Terminal 2)

```bash
cd frontend
npm install react-scripts react react-dom react-router-dom axios framer-motion lucide-react --save
npm start
```

## Access

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **API Docs**: http://localhost:8001/docs

## Features

- **Landing Page**: Stunning hero with animations, features, testimonials
- **Registration**: Role selection (Sugar Baby/Daddy/Mommy), multi-step signup
- **Profile Setup**: 5-step wizard (Photos, Video & Voice, About, Lifestyle, Expectations)
- **Dashboard**: Stats, quick actions, verification progress
- **Discovery**: Tinder-style swipe cards with photos, videos, voice badges
- **Matches**: New matches grid, conversations list
- **Messages**: Real-time chat with media support
- **Profile Editor**: 8 photos, video, voice note, all profile fields
- **Settings**: Preferences, privacy, billing, support

## Tech Stack

- **Frontend**: React 18, Framer Motion, Lucide Icons
- **Backend**: Python/FastAPI
- **Database**: Supabase (PostgreSQL)
- **Auth**: JWT + bcrypt
- **Email**: Resend API

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
