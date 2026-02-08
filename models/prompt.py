from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid

class PromptTemplate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    category: str
    question: str
    
PROMPT_LIBRARY = [
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