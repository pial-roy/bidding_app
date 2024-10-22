from fastapi import FastAPI, HTTPException, Response  # Import Response here
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .database import get_database
from .crud import router as crud_route
from .bid import bid_router
import bcrypt
from datetime import timedelta
from .oauth2 import create_access_token
from dotenv import load_dotenv
import os

from starlette.middleware.sessions import SessionMiddleware

app = FastAPI()
# Register routes for auction items
app.include_router(crud_route)
# Register the bid router
app.include_router(bid_router)
# Configure session middleware
app.add_middleware(SessionMiddleware, secret_key="your_secret_key", max_age=3600)  # Set max_age to 1 hour (or whatever you need)

# Load environment variables
load_dotenv()
print(f"MONGODB_URL: {os.getenv('MONGODB_URL')}")  # Add this line to debug the URL

# Add CORS middleware with dynamic origin
origins = [
    os.getenv("FRONTEND_URL"),  # Frontend URL from .env
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True, #Allow cookies
    allow_methods=["*"],
    allow_headers=["*"],
)

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
async def login_user(user: UserLogin, response: Response):  # Now Response is defined
    db = await get_database()
    db_user = await db.users.find_one({"email": user.email})

    if not db_user or not bcrypt.checkpw(user.password.encode('utf-8'), db_user['password'].encode('utf-8')):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    # Instead of generating a JWT, generate a session ID and store it
    session_id = str(db_user["_id"])  # Or create a random session ID
    response.set_cookie(
    key="session_id",
    value=session_id,
    httponly=True,
    samesite="Lax",  # Use 'Strict' or 'Lax' depending on your requirements
    secure=False  # Set to True if using HTTPS
)

    return {"message": "Login successful", "username": db_user["username"]}