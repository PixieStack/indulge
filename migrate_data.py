import asyncio
import asyncpg
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
from pathlib import Path
from datetime import datetime
import json

def parse_datetime(dt_str):
    """Convert ISO string to datetime object"""
    if dt_str:
        try:
            return datetime.fromisoformat(dt_str.replace('Z', '+00:00'))
        except:
            return None
    return None

def to_json(val):
    """Convert Python list/dict to JSON"""
    if val is None:
        return None
    if isinstance(val, (list, dict)):
        return json.dumps(val)
    return val

async def migrate_data():
    load_dotenv(Path(__file__).parent / '.env')
    
    # Connect to MongoDB
    mongo_client = AsyncIOMotorClient(os.environ['MONGO_URL'])
    mongo_db = mongo_client[os.environ['DB_NAME']]
    
    # Connect to Supabase
    supabase = await asyncpg.connect(
        host='aws-1-eu-central-1.pooler.supabase.com',
        port=6543,
        user='postgres.sshmfhetibzybiquduff',
        password='Tt@{1999&04[23%]}(#eden!)',
        database='postgres',
        ssl='require',
        statement_cache_size=0  # Required for pgbouncer
    )
    
    print('✓ Connected to both databases')
    
    # Migrate users
    print('\nMigrating users...')
    users = await mongo_db.users.find({}, {'_id': 0}).to_list(1000)
    user_count = 0
    for user in users:
        try:
            await supabase.execute('''
                INSERT INTO users (
                    id, email, phone, password_hash, role, email_verified, phone_verified,
                    face_verified, verification_paid, email_otp, phone_otp, otp_expires_at,
                    first_name, age, gender, orientation, location, income_bracket, net_worth,
                    allowance_expectation, lifestyle_tags, height, education, smoking, drinking,
                    photos, video_url, voice_url, prompts, is_premium, subscription_ends,
                    created_at, last_active, is_banned
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17,
                    $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34
                )
                ON CONFLICT (id) DO NOTHING
            ''', 
                user.get('id'), user.get('email'), user.get('phone'), user.get('password_hash'),
                user.get('role'), user.get('email_verified', False), user.get('phone_verified', False),
                user.get('face_verified', False), user.get('verification_paid', False),
                user.get('email_otp'), user.get('phone_otp'), parse_datetime(user.get('otp_expires_at')),
                user.get('first_name'), user.get('age'), user.get('gender'), user.get('orientation'),
                user.get('location'), user.get('income_bracket'), user.get('net_worth'),
                user.get('allowance_expectation'), to_json(user.get('lifestyle_tags', [])), user.get('height'),
                user.get('education'), user.get('smoking'), user.get('drinking'),
                to_json(user.get('photos', [])), user.get('video_url'), user.get('voice_url'),
                to_json(user.get('prompts', [])), user.get('is_premium', False), parse_datetime(user.get('subscription_ends')),
                parse_datetime(user.get('created_at')), parse_datetime(user.get('last_active')), user.get('is_banned', False)
            )
            user_count += 1
        except Exception as e:
            print(f'  Error migrating user {user.get("email")}: {e}')
    
    print(f'✓ Migrated {user_count} users')
    
    # Migrate likes
    print('\nMigrating likes...')
    likes = await mongo_db.likes.find({}, {'_id': 0}).to_list(1000)
    like_count = 0
    for like in likes:
        try:
            await supabase.execute('''
                INSERT INTO likes (id, from_user_id, to_user_id, liked_element, comment, created_at)
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT (id) DO NOTHING
            ''', like.get('id'), like.get('from_user_id'), like.get('to_user_id'),
                like.get('liked_element'), like.get('comment'), parse_datetime(like.get('created_at')))
            like_count += 1
        except Exception as e:
            print(f'  Error migrating like: {e}')
    
    print(f'✓ Migrated {like_count} likes')
    
    # Migrate matches
    print('\nMigrating matches...')
    matches = await mongo_db.matches.find({}, {'_id': 0}).to_list(1000)
    match_count = 0
    for match in matches:
        try:
            await supabase.execute('''
                INSERT INTO matches (id, user1_id, user2_id, match_context, created_at, last_message_at, is_active)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (id) DO NOTHING
            ''', match.get('id'), match.get('user1_id'), match.get('user2_id'),
                match.get('match_context'), parse_datetime(match.get('created_at')), 
                parse_datetime(match.get('last_message_at')), match.get('is_active', True))
            match_count += 1
        except Exception as e:
            print(f'  Error migrating match: {e}')
    
    print(f'✓ Migrated {match_count} matches')
    
    # Migrate messages
    print('\nMigrating messages...')
    messages = await mongo_db.messages.find({}, {'_id': 0}).to_list(1000)
    message_count = 0
    for message in messages:
        try:
            await supabase.execute('''
                INSERT INTO messages (id, match_id, sender_id, receiver_id, content, media_url,
                                    media_type, view_once, viewed, created_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                ON CONFLICT (id) DO NOTHING
            ''', message.get('id'), message.get('match_id'), message.get('sender_id'),
                message.get('receiver_id'), message.get('content'), message.get('media_url'),
                message.get('media_type'), message.get('view_once', False),
                message.get('viewed', False), parse_datetime(message.get('created_at')))
            message_count += 1
        except Exception as e:
            print(f'  Error migrating message: {e}')
    
    print(f'✓ Migrated {message_count} messages')
    
    # Migrate passes
    print('\nMigrating passes...')
    passes = await mongo_db.passes.find({}, {'_id': 0}).to_list(1000)
    pass_count = 0
    for pass_obj in passes:
        try:
            await supabase.execute('''
                INSERT INTO passes (id, from_user_id, to_user_id, created_at)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (id) DO NOTHING
            ''', pass_obj.get('id'), pass_obj.get('from_user_id'),
                pass_obj.get('to_user_id'), parse_datetime(pass_obj.get('created_at')))
            pass_count += 1
        except Exception as e:
            print(f'  Error migrating pass: {e}')
    
    print(f'✓ Migrated {pass_count} passes')
    
    # Summary
    print('\n' + '='*50)
    print('MIGRATION SUMMARY')
    print('='*50)
    print(f'Users:    {user_count}')
    print(f'Likes:    {like_count}')
    print(f'Matches:  {match_count}')
    print(f'Messages: {message_count}')
    print(f'Passes:   {pass_count}')
    print('='*50)
    print('✓ Migration complete!')
    
    await supabase.close()
    mongo_client.close()

if __name__ == "__main__":
    asyncio.run(migrate_data())
