from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import FastAPI
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")

client = AsyncIOMotorClient(MONGODB_URL)
db = client[DATABASE_NAME]  # Use the database name from the environment

# Create a function to get the database
async def get_database():
    return db