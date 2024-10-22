# backend/app/models.py
from pydantic import BaseModel, Field, validator
from typing import List
from datetime import datetime, timedelta  # Import timedelta for auction end time calculation
import pytz

class Bid(BaseModel):
    user_id: str  # Reference to the user who placed the bid
    username: str  # Include the username in the bid
    item_id: str  # Reference to the auction item
    amount: float  # The bid amount
    timestamp: datetime  # When the bid was placed

class AuctionItem(BaseModel):
    name: str
    description: str
    starting_price: float
    auction_start_time: datetime  # Ensure this can be timezone-aware
    duration: int  # Duration in minutes
    bids: List[Bid] = []  # List to store bids

    @validator('duration')
    def check_duration(cls, v):
        if v is None or v <= 0:
            raise ValueError('Duration must be a positive integer')
        return v

    def get_auction_end_time(self):
        return self.auction_start_time + timedelta(minutes=self.duration)

class User(BaseModel):
    username: str = Field(..., unique=True)
    email: str = Field(..., unique=True)
    password: str