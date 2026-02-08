from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from sqlalchemy import select, update, delete, and_, or_, func
from sqlalchemy.ext.asyncio import AsyncSession
import os
import logging
from pathlib import Path
from datetime import datetime, timezone, timedelta
from typing import List, Optional
import uuid
import asyncio
import random
import resend
import phonenumbers
from phonenumbers import geocoder, carrier

# Database
from database import AsyncSessionLocal, engine, Base
from models_pg import User, Like, Match, Message, Pass, PaymentTransaction

# Models
from pydantic import BaseModel, EmailStr

# Utils
from passlib.context import CryptContext
from jose import JWTError, jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Resend setup
resend.api_key = os.environ.get('RESEND_API_KEY')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')

# Twilio setup
TWILIO_ACCOUNT_SID = os.environ.get('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.environ.get('TWILIO_AUTH_TOKEN')

# Auth setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "YOUR_SECRET_KEY_REPLACE_ME")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7

security = HTTPBearer()

# Create the main app
app = FastAPI()

# Create API router
api_router = APIRouter(prefix="/api")

# ============= PYDANTIC MODELS =============

class UserCreate(BaseModel):
    email: EmailStr
    phone: str
    password: str
    role: str
    first_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class OTPRequest(BaseModel):
    type: str  # 'email' or 'phone'
    value: str  # email address or phone number

class OTPVerify(BaseModel):
    type: str
    value: str
    otp: str

# ============= DATABASE DEPENDENCY =============

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

# ============= UTILITY FUNCTIONS =============

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = decode_token(token)
    
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    return {"user_id": user_id, **payload}

def get_country_from_phone(phone_number: str):
    """Extract country information from phone number"""
    try:
        parsed = phonenumbers.parse(phone_number, None)
        country_code = phonenumbers.region_code_for_number(parsed)
        country_name = geocoder.description_for_number(parsed, "en")
        carrier_name = carrier.name_for_number(parsed, "en")
        
        return {
            "country_code": country_code,
            "country_name": country_name,
            "carrier": carrier_name,
            "is_valid": phonenumbers.is_valid_number(parsed)
        }
    except:
        return {"country_code": "Unknown", "country_name": "Unknown", "carrier": "", "is_valid": False}

async def send_email_otp(email: str, otp: str):
    """Send OTP via email using Resend"""
    try:
        params = {
            "from": SENDER_EMAIL,
            "to": [email],
            "subject": "INDULGE - Your Verification Code",
            "html": f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0B0F19; color: white; padding: 40px; border-radius: 10px;">
                <h1 style="color: #D4AF37; font-size: 32px; text-align: center;">INDULGE</h1>
                <p style="font-size: 18px; margin: 30px 0; text-align: center;">Your verification code is:</p>
                <div style="background: rgba(212, 175, 55, 0.1); border: 2px solid #D4AF37; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
                    <h2 style="font-size: 48px; letter-spacing: 10px; margin: 0; color: #D4AF37;">{otp}</h2>
                </div>
                <p style="color: #A1A1AA; font-size: 14px; text-align: center;">This code will expire in 10 minutes.</p>
                <p style="color: #A1A1AA; font-size: 14px; text-align: center;">If you didn't request this code, please ignore this email.</p>
            </div>
            """
        }
        result = await asyncio.to_thread(resend.Emails.send, params)
        print(f"✓ Email sent to {email} via Resend! ID: {result}")
        return True
    except Exception as e:
        print(f"✗ Failed to send email to {email}: {e}")
        return False

async def send_email_otp(email: str, otp: str):
    """Send OTP via email using Resend"""
    try:
        sender = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
        params = {
            "from": sender,
            "to": [email],
            "subject": "INDULGE - Your Verification Code",
            "html": f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0B0F19 0%, #1a1f2e 100%); color: white; padding: 40px; border-radius: 16px;">
                <h1 style="color: #D4AF37; font-size: 36px; text-align: center; margin-bottom: 10px;">INDULGE</h1>
                <p style="text-align: center; color: #888; font-size: 14px; margin-bottom: 30px;">Premium Dating</p>
                <p style="font-size: 18px; margin: 30px 0; text-align: center; color: #fff;">Your verification code is:</p>
                <div style="background: rgba(212, 175, 55, 0.15); border: 2px solid #D4AF37; padding: 25px; text-align: center; border-radius: 12px; margin: 20px 0;">
                    <h2 style="font-size: 42px; letter-spacing: 12px; margin: 0; color: #D4AF37; font-weight: bold;">{otp}</h2>
                </div>
                <p style="color: #888; font-size: 14px; text-align: center; margin-top: 25px;">This code will expire in 10 minutes.</p>
                <p style="color: #666; font-size: 12px; text-align: center; margin-top: 15px;">If you didn't request this code, please ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;">
                <p style="color: #555; font-size: 11px; text-align: center;">© 2025 INDULGE. All rights reserved.</p>
            </div>
            """
        }
        result = await asyncio.to_thread(resend.Emails.send, params)
        print(f"✓ Email sent to {email} via Resend! ID: {result}")
        return True
    except Exception as e:
        print(f"✗ Failed to send email to {email}: {e}")
        return False

async def send_sms_otp(phone: str):
    """Send OTP via SMS using Twilio Verify API"""
    try:
        from twilio.rest import Client
        
        account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
        auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
        verify_service_sid = os.environ.get('TWILIO_VERIFY_SERVICE_SID')
        
        if not account_sid or not auth_token:
            print(f"⚠️  Twilio not configured")
            return False
        
        client = Client(account_sid, auth_token)
        
        if verify_service_sid:
            verification = client.verify.v2.services(verify_service_sid).verifications.create(
                to=phone,
                channel='sms'
            )
            print(f"✓ SMS verification sent to {phone} via Twilio Verify! SID: {verification.sid}")
            return True
        else:
            print(f"⚠️  Twilio Verify Service not configured")
            return False
            
    except Exception as e:
        print(f"✗ SMS sending error for {phone}: {e}")
        return False

async def verify_sms_otp(phone: str, code: str):
    """Verify SMS OTP via Twilio Verify API"""
    try:
        from twilio.rest import Client
        
        account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
        auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
        verify_service_sid = os.environ.get('TWILIO_VERIFY_SERVICE_SID')
        
        if not verify_service_sid:
            return False
        
        client = Client(account_sid, auth_token)
        
        verification_check = client.verify.v2.services(verify_service_sid).verification_checks.create(
            to=phone,
            code=code
        )
        
        if verification_check.status == 'approved':
            print(f"✓ Phone {phone} verified successfully!")
            return True
        else:
            print(f"✗ Verification failed for {phone}: {verification_check.status}")
            return False
            
    except Exception as e:
        print(f"✗ Verification error for {phone}: {e}")
        return False

# ============= AUTH ROUTES =============

@api_router.post("/auth/signup")
async def signup(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    # Check if user exists
    result = await db.execute(select(User).where(User.email == user_data.email))
    existing_user = result.scalar_one_or_none()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Get country from phone
    country_info = get_country_from_phone(user_data.phone)
    
    # Create user
    user_id = str(uuid.uuid4())
    
    new_user = User(
        id=user_id,
        email=user_data.email,
        phone=user_data.phone,
        password_hash=get_password_hash(user_data.password),
        role=user_data.role,
        first_name=user_data.first_name,
        location=country_info.get("country_name", ""),
        email_verified=False,
        phone_verified=False,
        face_verified=False,
        verification_paid=False,
        photos=[],
        prompts=[],
        lifestyle_tags=[],
        is_premium=False,
        is_banned=False,
        created_at=datetime.now(timezone.utc),
        last_active=datetime.now(timezone.utc)
    )
    
    db.add(new_user)
    await db.commit()
    
    # Create token
    token = create_access_token(data={"sub": user_id, "email": user_data.email, "role": user_data.role})
    
    return {
        "token": token,
        "user": {
            "id": user_id,
            "email": user_data.email,
            "phone": user_data.phone,
            "role": user_data.role,
            "first_name": user_data.first_name,
            "country": country_info.get("country_name", ""),
            "email_verified": False,
            "phone_verified": False,
            "face_verified": False,
            "verification_paid": False
        }
    }

@api_router.post("/auth/login")
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == credentials.email))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Update last active
    user.last_active = datetime.now(timezone.utc)
    await db.commit()
    
    token = create_access_token(data={"sub": user.id, "email": user.email, "role": user.role})
    
    return {
        "token": token,
        "user": {
            "id": user.id,
            "email": user.email,
            "phone": user.phone or "",
            "role": user.role,
            "first_name": user.first_name or "",
            "email_verified": user.email_verified,
            "phone_verified": user.phone_verified,
            "face_verified": user.face_verified,
            "verification_paid": user.verification_paid
        }
    }

# ============= VERIFICATION ROUTES =============

@api_router.post("/verification/send-otp")
async def send_otp(data: OTPRequest, current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == current_user["user_id"]))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    success = False
    message = ""
    
    if data.type == "email":
        # Generate 6-digit OTP for email (using Resend)
        otp = str(random.randint(100000, 999999))
        expiry = datetime.now(timezone.utc) + timedelta(minutes=10)
        user.email_otp = otp
        user.otp_expires_at = expiry
        await db.commit()
        
        success = await send_email_otp(data.value, otp)
        message = f"Verification code sent to {data.value}"
        
    elif data.type == "phone":
        # Use Twilio Verify API for SMS (it generates its own code)
        success = await send_sms_otp(data.value)
        message = f"Verification code sent to {data.value}"
    
    if success:
        return {
            "success": True, 
            "message": message,
            "note": "Please check your email or phone for the 6-digit verification code"
        }
    
    error_msg = "Failed to send verification code to your email. Please try again." if data.type == "email" else "Failed to send SMS. Please check your phone number format."
    return {"success": False, "message": error_msg}

@api_router.post("/verification/verify-otp")
async def verify_otp_endpoint(data: OTPVerify, current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == current_user["user_id"]))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if data.type == "email":
        # Verify email OTP (stored in our database via Resend)
        if user.otp_expires_at and datetime.now(timezone.utc) > user.otp_expires_at:
            raise HTTPException(status_code=400, detail="OTP expired. Please request a new code.")
        
        if user.email_otp != data.otp:
            raise HTTPException(status_code=400, detail="Invalid verification code")
        
        user.email_verified = True
        user.email_otp = None
        await db.commit()
        
    elif data.type == "phone":
        # Verify phone OTP via Twilio Verify API
        verified = await verify_sms_otp(data.value, data.otp)
        
        if not verified:
            raise HTTPException(status_code=400, detail="Invalid verification code")
        
        user.phone_verified = True
        await db.commit()
    
    return {"success": True, "message": f"{data.type} verified successfully"}

@api_router.post("/verification/face")
async def verify_face(current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == current_user["user_id"]))
    user = result.scalar_one_or_none()
    if user:
        user.face_verified = True
        await db.commit()
    return {"success": True}

@api_router.post("/verification/payment")
async def process_verification_payment(data: dict, current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == current_user["user_id"]))
    user = result.scalar_one_or_none()
    if user:
        user.verification_paid = True
        await db.commit()
    return {"success": True, "payment_intent": "mock_pi_123"}

# ============= PROFILE ROUTES =============

@api_router.get("/profile/me")
async def get_my_profile(current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == current_user["user_id"]))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": user.id,
        "email": user.email,
        "phone": user.phone,
        "role": user.role,
        "first_name": user.first_name,
        "age": user.age,
        "gender": user.gender,
        "orientation": user.orientation,
        "location": user.location,
        "income_bracket": user.income_bracket,
        "net_worth": user.net_worth,
        "allowance_expectation": user.allowance_expectation,
        "lifestyle_tags": user.lifestyle_tags or [],
        "height": user.height,
        "education": user.education,
        "smoking": user.smoking,
        "drinking": user.drinking,
        "photos": user.photos or [],
        "video_url": user.video_url,
        "voice_url": user.voice_url,
        "prompts": user.prompts or [],
        "is_premium": user.is_premium,
        "email_verified": user.email_verified,
        "phone_verified": user.phone_verified,
        "face_verified": user.face_verified,
        "verification_paid": user.verification_paid,
        "created_at": user.created_at.isoformat() if user.created_at else None,
        "last_active": user.last_active.isoformat() if user.last_active else None
    }

@api_router.put("/profile/me")
async def update_profile(data: dict, current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == current_user["user_id"]))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update allowed fields
    allowed_fields = [
        'age', 'gender', 'orientation', 'location', 'income_bracket', 'net_worth',
        'allowance_expectation', 'lifestyle_tags', 'height', 'education', 'smoking',
        'drinking', 'photos', 'video_url', 'voice_url', 'prompts', 'preferred_gender',
        'preferred_age_min', 'preferred_age_max'
    ]
    
    for field in allowed_fields:
        if field in data:
            setattr(user, field, data[field])
    
    await db.commit()
    
    return await get_my_profile(current_user, db)

@api_router.post("/profile/upload-media")
async def upload_media(file: UploadFile = File(...), media_type: str = Form(...), current_user: dict = Depends(get_current_user)):
    mock_url = f"https://storage.indulge.app/{current_user['user_id']}/{media_type}_{datetime.now().timestamp()}"
    return {"url": mock_url}

# ============= DISCOVERY ROUTES =============

@api_router.get("/discovery/feed")
async def get_discovery_feed(current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == current_user["user_id"]))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get users already liked or passed
    likes_result = await db.execute(select(Like.to_user_id).where(Like.from_user_id == current_user["user_id"]))
    liked_ids = [row[0] for row in likes_result.fetchall()]
    
    passes_result = await db.execute(select(Pass.to_user_id).where(Pass.from_user_id == current_user["user_id"]))
    passed_ids = [row[0] for row in passes_result.fetchall()]
    
    excluded_ids = [current_user["user_id"]] + liked_ids + passed_ids
    
    # Build query based on role
    if user.role == "baby":
        role_filter = User.role.in_(["daddy", "mommy"])
    else:
        role_filter = User.role == "baby"
    
    query = select(User).where(
        and_(
            User.id.notin_(excluded_ids),
            User.is_banned == False,
            role_filter
        )
    ).limit(20)
    
    results = await db.execute(query)
    users = results.scalars().all()
    
    profiles = []
    for u in users:
        profiles.append({
            "id": u.id,
            "first_name": u.first_name,
            "age": u.age,
            "gender": u.gender,
            "location": u.location,
            "photos": u.photos or [],
            "video_url": u.video_url,
            "voice_url": u.voice_url,
            "prompts": u.prompts or [],
            "lifestyle_tags": u.lifestyle_tags or [],
            "role": u.role,
            "income_bracket": u.income_bracket,
            "allowance_expectation": u.allowance_expectation,
            "last_active": u.last_active.isoformat() if u.last_active else None
        })
    
    return {"profiles": profiles}

@api_router.post("/discovery/like")
async def like_profile(data: dict, current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    like = Like(
        id=str(uuid.uuid4()),
        from_user_id=current_user["user_id"],
        to_user_id=data["to_user_id"],
        liked_element=data.get("liked_element", "profile"),
        comment=data.get("comment"),
        created_at=datetime.now(timezone.utc)
    )
    
    db.add(like)
    await db.commit()
    
    # Check for mutual like
    mutual_result = await db.execute(
        select(Like).where(
            and_(
                Like.from_user_id == data["to_user_id"],
                Like.to_user_id == current_user["user_id"]
            )
        )
    )
    mutual_like = mutual_result.scalar_one_or_none()
    
    if mutual_like:
        match = Match(
            id=str(uuid.uuid4()),
            user1_id=current_user["user_id"],
            user2_id=data["to_user_id"],
            match_context=like.liked_element,
            created_at=datetime.now(timezone.utc),
            is_active=True
        )
        db.add(match)
        await db.commit()
        return {"matched": True, "match_id": match.id}
    
    return {"matched": False}

@api_router.post("/discovery/pass")
async def pass_profile(data: dict, current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    pass_obj = Pass(
        id=str(uuid.uuid4()),
        from_user_id=current_user["user_id"],
        to_user_id=data["to_user_id"],
        created_at=datetime.now(timezone.utc)
    )
    db.add(pass_obj)
    await db.commit()
    return {"success": True}

# ============= MATCHES & MESSAGES =============

@api_router.get("/matches")
async def get_matches(current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Match).where(
            and_(
                or_(
                    Match.user1_id == current_user["user_id"],
                    Match.user2_id == current_user["user_id"]
                ),
                Match.is_active == True
            )
        )
    )
    matches = result.scalars().all()
    
    match_list = []
    for match in matches:
        other_user_id = match.user2_id if match.user1_id == current_user["user_id"] else match.user1_id
        
        user_result = await db.execute(select(User).where(User.id == other_user_id))
        other_user = user_result.scalar_one_or_none()
        
        msg_result = await db.execute(
            select(Message).where(Message.match_id == match.id).order_by(Message.created_at.desc()).limit(1)
        )
        last_message = msg_result.scalar_one_or_none()
        
        match_list.append({
            "id": match.id,
            "user1_id": match.user1_id,
            "user2_id": match.user2_id,
            "match_context": match.match_context,
            "created_at": match.created_at.isoformat() if match.created_at else None,
            "other_user": {
                "id": other_user.id,
                "first_name": other_user.first_name,
                "age": other_user.age,
                "photos": other_user.photos or [],
                "last_active": other_user.last_active.isoformat() if other_user.last_active else None
            } if other_user else None,
            "last_message": {
                "id": last_message.id,
                "content": last_message.content,
                "sender_id": last_message.sender_id,
                "created_at": last_message.created_at.isoformat() if last_message.created_at else None
            } if last_message else None
        })
    
    return {"matches": match_list}

@api_router.get("/messages/{match_id}")
async def get_messages(match_id: str, current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    # Verify user is part of the match
    match_result = await db.execute(
        select(Match).where(
            and_(
                Match.id == match_id,
                or_(
                    Match.user1_id == current_user["user_id"],
                    Match.user2_id == current_user["user_id"]
                )
            )
        )
    )
    match = match_result.scalar_one_or_none()
    
    if not match:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    msg_result = await db.execute(
        select(Message).where(Message.match_id == match_id).order_by(Message.created_at.asc())
    )
    messages = msg_result.scalars().all()
    
    # Mark messages as viewed
    await db.execute(
        update(Message).where(
            and_(
                Message.match_id == match_id,
                Message.receiver_id == current_user["user_id"],
                Message.viewed == False
            )
        ).values(viewed=True)
    )
    await db.commit()
    
    return {
        "messages": [
            {
                "id": msg.id,
                "match_id": msg.match_id,
                "sender_id": msg.sender_id,
                "receiver_id": msg.receiver_id,
                "content": msg.content,
                "media_url": msg.media_url,
                "media_type": msg.media_type,
                "view_once": msg.view_once,
                "viewed": msg.viewed,
                "created_at": msg.created_at.isoformat() if msg.created_at else None
            }
            for msg in messages
        ]
    }

@api_router.post("/messages")
async def send_message(msg_data: dict, current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    message = Message(
        id=str(uuid.uuid4()),
        match_id=msg_data["match_id"],
        sender_id=current_user["user_id"],
        receiver_id=msg_data["receiver_id"],
        content=msg_data.get("content"),
        media_url=msg_data.get("media_url"),
        media_type=msg_data.get("media_type"),
        view_once=msg_data.get("view_once", False),
        viewed=False,
        created_at=datetime.now(timezone.utc)
    )
    
    db.add(message)
    
    # Update match last_message_at
    await db.execute(
        update(Match).where(Match.id == msg_data["match_id"]).values(last_message_at=message.created_at)
    )
    
    await db.commit()
    
    return {
        "id": message.id,
        "match_id": message.match_id,
        "sender_id": message.sender_id,
        "receiver_id": message.receiver_id,
        "content": message.content,
        "created_at": message.created_at.isoformat()
    }

# ============= PROMPTS =============

@api_router.get("/prompts")
async def get_prompts():
    return [
        {"id": "1", "category": "The Basics", "question": "A fun fact about me..."},
        {"id": "2", "category": "The Basics", "question": "I'm looking for..."},
        {"id": "3", "category": "The Basics", "question": "My perfect weekend looks like..."},
        {"id": "4", "category": "Lifestyle", "question": "My travel bucket list includes..."},
        {"id": "5", "category": "Lifestyle", "question": "I feel most alive when..."},
        {"id": "6", "category": "Lifestyle", "question": "My guilty pleasure is..."},
        {"id": "7", "category": "Lifestyle", "question": "I can't live without..."},
        {"id": "8", "category": "The Arrangement", "question": "I show appreciation by..."},
        {"id": "9", "category": "The Arrangement", "question": "Generosity means..."},
        {"id": "10", "category": "The Arrangement", "question": "My love language is..."},
        {"id": "11", "category": "The Arrangement", "question": "I spoil by..."},
        {"id": "12", "category": "The Basics", "question": "My ideal first date..."},
        {"id": "13", "category": "Lifestyle", "question": "I'm passionate about..."},
        {"id": "14", "category": "Lifestyle", "question": "My favorite luxury is..."},
        {"id": "15", "category": "The Arrangement", "question": "What I value most in a connection..."},
    ]

# ============= SUBSCRIPTION =============

@api_router.post("/subscription/subscribe")
async def subscribe(data: dict, current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    duration_months = data.get("duration_months", 1)
    subscription_ends = datetime.now(timezone.utc) + timedelta(days=30*duration_months)
    
    result = await db.execute(select(User).where(User.id == current_user["user_id"]))
    user = result.scalar_one_or_none()
    if user:
        user.is_premium = True
        user.subscription_ends = subscription_ends
        await db.commit()
    
    return {"success": True, "subscription_ends": subscription_ends.isoformat()}

# ============= ADMIN =============

@api_router.get("/admin/users")
async def get_all_users(current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User))
    users = result.scalars().all()
    
    return {
        "users": [
            {
                "id": u.id,
                "email": u.email,
                "phone": u.phone,
                "role": u.role,
                "first_name": u.first_name,
                "email_verified": u.email_verified,
                "phone_verified": u.phone_verified,
                "face_verified": u.face_verified,
                "is_premium": u.is_premium,
                "is_banned": u.is_banned,
                "created_at": u.created_at.isoformat() if u.created_at else None
            }
            for u in users
        ]
    }

@api_router.get("/admin/stats")
async def get_stats(db: AsyncSession = Depends(get_db)):
    total_users = await db.execute(select(func.count(User.id)))
    verified_users = await db.execute(select(func.count(User.id)).where(User.face_verified == True))
    premium_users = await db.execute(select(func.count(User.id)).where(User.is_premium == True))
    total_matches = await db.execute(select(func.count(Match.id)))
    
    return {
        "total_users": total_users.scalar() or 0,
        "verified_users": verified_users.scalar() or 0,
        "premium_users": premium_users.scalar() or 0,
        "total_matches": total_matches.scalar() or 0
    }

# Include the router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create tables on startup
@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables created/verified")
