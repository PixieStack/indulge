-- INDULGE Database Schema

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    face_verified BOOLEAN DEFAULT FALSE,
    verification_paid BOOLEAN DEFAULT FALSE,
    email_otp VARCHAR(10),
    phone_otp VARCHAR(10),
    otp_expires_at TIMESTAMP WITH TIME ZONE,
    
    first_name VARCHAR(100) NOT NULL,
    age INTEGER,
    gender VARCHAR(50),
    orientation VARCHAR(50),
    location VARCHAR(255),
    
    income_bracket VARCHAR(50),
    net_worth VARCHAR(50),
    allowance_expectation VARCHAR(50),
    
    lifestyle_tags JSONB DEFAULT '[]'::jsonb,
    height VARCHAR(20),
    education VARCHAR(100),
    smoking VARCHAR(20),
    drinking VARCHAR(20),
    
    photos JSONB DEFAULT '[]'::jsonb,
    video_url TEXT,
    voice_url TEXT,
    
    prompts JSONB DEFAULT '[]'::jsonb,
    
    is_premium BOOLEAN DEFAULT FALSE,
    subscription_ends TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_banned BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);

CREATE TABLE IF NOT EXISTS likes (
    id VARCHAR(36) PRIMARY KEY,
    from_user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    to_user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    liked_element VARCHAR(100) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_likes_from_user ON likes(from_user_id);
CREATE INDEX idx_likes_to_user ON likes(to_user_id);

CREATE TABLE IF NOT EXISTS matches (
    id VARCHAR(36) PRIMARY KEY,
    user1_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user2_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    match_context VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_message_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_matches_user1 ON matches(user1_id);
CREATE INDEX idx_matches_user2 ON matches(user2_id);

CREATE TABLE IF NOT EXISTS messages (
    id VARCHAR(36) PRIMARY KEY,
    match_id VARCHAR(36) NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    sender_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    content TEXT,
    media_url TEXT,
    media_type VARCHAR(20),
    
    view_once BOOLEAN DEFAULT FALSE,
    viewed BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_messages_match ON messages(match_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);

CREATE TABLE IF NOT EXISTS passes (
    id VARCHAR(36) PRIMARY KEY,
    from_user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    to_user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_passes_from_user ON passes(from_user_id);
CREATE INDEX idx_passes_to_user ON passes(to_user_id);

CREATE TABLE IF NOT EXISTS payment_transactions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    payment_id VARCHAR(255),
    
    amount DOUBLE PRECISION NOT NULL,
    currency VARCHAR(10) NOT NULL,
    
    transaction_type VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending',
    
    extra_data JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payments_user ON payment_transactions(user_id);
CREATE INDEX idx_payments_session ON payment_transactions(session_id);
CREATE INDEX idx_payments_status ON payment_transactions(payment_status);
