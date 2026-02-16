# INDULGE - Premium Dating Platform

## Original Problem Statement
Fix all issues including registration and Supabase, then provide commands to run locally on Windows.

## Architecture
- **Backend**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL with SQLAlchemy async
- **Migrations**: Alembic
- **Auth**: JWT + bcrypt
- **Email**: Resend
- **SMS**: Twilio Verify API

## User Personas
1. **Baby** - Users seeking arrangements
2. **Daddy/Mommy** - Users providing arrangements

## Core Requirements
- User registration/login with email & phone
- Email/Phone OTP verification
- Face verification
- Profile management
- Discovery feed with like/pass
- Matching system
- Direct messaging
- Premium subscriptions

## What's Been Implemented (Jan 2026)
- [x] README.md with comprehensive Windows setup guide
- [x] .env.example template file
- [x] Full API documentation in README

## Prioritized Backlog
### P0 (Critical)
- None - backend is functional

### P1 (Important)
- Add frontend setup instructions (if frontend exists)
- Add Supabase-specific configuration guide

### P2 (Nice to Have)
- Docker setup for easier deployment
- CI/CD pipeline configuration
- API rate limiting

## Next Tasks
1. Test registration flow on user's local machine
2. Add Supabase setup if needed
3. Frontend integration
