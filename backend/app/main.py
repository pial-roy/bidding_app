# backend/app/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .database import get_database
from .crud import router as crud_router
import bcrypt
from datetime import timedelta
from .oauth2 import create_access_token
from dotenv import load_dotenv
import os
# Load environment variables
load_dotenv()
print(f"MONGODB_URL: {os.getenv('MONGODB_URL')}")  # Add this line to debug the URL
app = FastAPI()

# Add CORS middleware with dynamic origin
origins = [
    os.getenv("FRONTEND_URL"),  # Frontend URL from .env
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes for auction items
app.include_router(crud_router)

# User-related routes
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

@app.post("/register/")
async def register_user(user: UserCreate):
    db = await get_database()
    existing_user = await db.users.find_one({"username": user.username})
    existing_email = await db.users.find_one({"email": user.email})

    if existing_user or existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    new_user = {
        "username": user.username,
        "email": user.email,
        "password": hashed_password.decode('utf-8')
    }
    
    await db.users.insert_one(new_user)
    return {"message": "User registered successfully!"}

@app.post("/login/")
async def login_user(user: UserLogin):
    db = await get_database()
    db_user = await db.users.find_one({"email": user.email})

    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    if not bcrypt.checkpw(user.password.encode('utf-8'), db_user['password'].encode('utf-8')):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    # Create a JWT token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": str(db_user["_id"])}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer", "username": db_user["username"]}