from fastapi import Depends, HTTPException, Request
from datetime import datetime, timedelta  # Ensure timedelta is imported
from .models import User
from .database import get_database
from bson import ObjectId
from dotenv import load_dotenv
import os

load_dotenv()

# Function to extract session ID from cookies
async def get_session_id(request: Request):
    session_id = request.cookies.get("session_id")
    if not session_id:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return session_id

# Function to get current user based on session ID
async def get_current_user(session_id: str = Depends(get_session_id)):
    db = await get_database()
    user = await db.users.find_one({"_id": ObjectId(session_id)})

    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    return user

# JWT Access Token Creation (Optional, remove if not needed)
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, os.getenv("SECRET_KEY"), algorithm="HS256")