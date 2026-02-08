from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, ForeignKey, JSON, Float
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime, timezone
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = 'users'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone = Column(String(20), nullable=True, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, index=True)
    
    # Verification
    email_verified = Column(Boolean, default=False)
    phone_verified = Column(Boolean, default=False)
    face_verified = Column(Boolean, default=False)
    verification_paid = Column(Boolean, default=False)
    email_otp = Column(String(10), nullable=True)
    phone_otp = Column(String(10), nullable=True)
    otp_expires_at = Column(DateTime(timezone=True), nullable=True)
    
    # Profile Basic
    first_name = Column(String(100), nullable=False)
    age = Column(Integer, nullable=True)
    gender = Column(String(50), nullable=True)
    orientation = Column(String(50), nullable=True)
    location = Column(String(255), nullable=True)
    
    # Financial
    income_bracket = Column(String(50), nullable=True)
    net_worth = Column(String(50), nullable=True)
    allowance_expectation = Column(String(50), nullable=True)
    
    # Lifestyle
    lifestyle_tags = Column(JSON, default=list)
    height = Column(String(20), nullable=True)
    education = Column(String(100), nullable=True)
    smoking = Column(String(20), nullable=True)
    drinking = Column(String(20), nullable=True)
    
    # Media
    photos = Column(JSON, default=list)
    video_url = Column(Text, nullable=True)
    voice_url = Column(Text, nullable=True)
    
    # Prompts
    prompts = Column(JSON, default=list)
    
    # Subscription
    is_premium = Column(Boolean, default=False)
    subscription_ends = Column(DateTime(timezone=True), nullable=True)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    last_active = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    is_banned = Column(Boolean, default=False)
    
    # Relationships
    likes_given = relationship('Like', foreign_keys='Like.from_user_id', back_populates='from_user')
    likes_received = relationship('Like', foreign_keys='Like.to_user_id', back_populates='to_user')
    messages_sent = relationship('Message', foreign_keys='Message.sender_id', back_populates='sender')
    messages_received = relationship('Message', foreign_keys='Message.receiver_id', back_populates='receiver')

class Like(Base):
    __tablename__ = 'likes'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    from_user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    to_user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    liked_element = Column(String(100), nullable=False)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    
    from_user = relationship('User', foreign_keys=[from_user_id], back_populates='likes_given')
    to_user = relationship('User', foreign_keys=[to_user_id], back_populates='likes_received')

class Match(Base):
    __tablename__ = 'matches'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user1_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    user2_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    match_context = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    last_message_at = Column(DateTime(timezone=True), nullable=True)
    is_active = Column(Boolean, default=True)

class Message(Base):
    __tablename__ = 'messages'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    match_id = Column(String(36), ForeignKey('matches.id', ondelete='CASCADE'), nullable=False, index=True)
    sender_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    receiver_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    
    content = Column(Text, nullable=True)
    media_url = Column(Text, nullable=True)
    media_type = Column(String(20), nullable=True)
    
    view_once = Column(Boolean, default=False)
    viewed = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    
    sender = relationship('User', foreign_keys=[sender_id], back_populates='messages_sent')
    receiver = relationship('User', foreign_keys=[receiver_id], back_populates='messages_received')

class Pass(Base):
    __tablename__ = 'passes'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    from_user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    to_user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

class PaymentTransaction(Base):
    __tablename__ = 'payment_transactions'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    session_id = Column(String(255), unique=True, nullable=False, index=True)
    payment_id = Column(String(255), nullable=True)
    
    amount = Column(Float, nullable=False)
    currency = Column(String(10), nullable=False)
    
    transaction_type = Column(String(50), nullable=False)
    payment_status = Column(String(50), default='pending', index=True)
    
    extra_data = Column(JSON, default=dict)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))