from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Literal
from datetime import datetime, timezone
import uuid

class Message(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    match_id: str
    sender_id: str
    receiver_id: str
    
    content: Optional[str] = None
    media_url: Optional[str] = None
    media_type: Optional[Literal["image", "video", "voice"]] = None
    
    view_once: bool = False
    viewed: bool = False
    
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class MessageCreate(BaseModel):
    match_id: str
    receiver_id: str
    content: Optional[str] = None
    media_url: Optional[str] = None
    media_type: Optional[Literal["image", "video", "voice"]] = None
    view_once: bool = False