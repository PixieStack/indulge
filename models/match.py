from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Literal
from datetime import datetime, timezone
import uuid

class Like(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    from_user_id: str
    to_user_id: str
    liked_element: str  # 'photo_1', 'prompt_2', 'voice', etc
    comment: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class Match(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user1_id: str
    user2_id: str
    match_context: str  # What element caused the match
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    last_message_at: Optional[str] = None
    is_active: bool = True

class Pass(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    from_user_id: str
    to_user_id: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())