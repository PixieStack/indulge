from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import Optional, List, Literal
from datetime import datetime, timezone
import uuid

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    phone: Optional[str] = None
    password_hash: str
    role: Literal["baby", "daddy", "mommy"]
    
    # Verification
    email_verified: bool = False
    phone_verified: bool = False
    face_verified: bool = False
    verification_paid: bool = False
    
    # Profile Basic
    first_name: str
    age: int
    gender: str
    orientation: str
    location: str
    
    # Financial (role dependent)
    income_bracket: Optional[str] = None
    net_worth: Optional[str] = None
    allowance_expectation: Optional[str] = None
    
    # Lifestyle
    lifestyle_tags: List[str] = []
    height: Optional[str] = None
    education: Optional[str] = None
    smoking: Optional[str] = None
    drinking: Optional[str] = None
    
    # Media
    photos: List[str] = []
    video_url: Optional[str] = None
    voice_url: Optional[str] = None
    
    # Prompts
    prompts: List[dict] = []
    
    # Subscription
    is_premium: bool = False
    subscription_ends: Optional[str] = None
    
    # Metadata
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    last_active: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    is_banned: bool = False
    
class UserCreate(BaseModel):
    email: EmailStr
    phone: str
    password: str
    role: Literal["baby", "daddy", "mommy"]
    first_name: str
    
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserPublic(BaseModel):
    id: str
    first_name: str
    age: int
    gender: str
    location: str
    role: str
    photos: List[str]
    video_url: Optional[str]
    voice_url: Optional[str]
    prompts: List[dict]
    income_bracket: Optional[str]
    allowance_expectation: Optional[str]
    lifestyle_tags: List[str]
    is_premium: bool
    face_verified: bool