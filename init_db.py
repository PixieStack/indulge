import asyncio
import asyncpg
from dotenv import load_dotenv
import os
from pathlib import Path
from urllib.parse import urlparse

async def init_database():
    load_dotenv(Path(__file__).parent / '.env')
    
    # Get connection string
    database_url = os.environ.get('DATABASE_URL')
    
    # Parse the URL for asyncpg
    parsed = urlparse(database_url)
    
    # Read SQL file
    sql_file = Path(__file__).parent / 'init_db.sql'
    with open(sql_file, 'r') as f:
        sql_commands = f.read()
    
    # Connect and execute with explicit parameters
    try:
        conn = await asyncpg.connect(
            host=parsed.hostname,
            port=parsed.port,
            user=parsed.username,
            password=parsed.password,
            database=parsed.path.lstrip('/'),
            ssl='require'
        )
        await conn.execute(sql_commands)
        print("✓ Database schema created successfully!")
        await conn.close()
    except Exception as e:
        print(f"✗ Error creating schema: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(init_database())
