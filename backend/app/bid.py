# backend/app/bid.py
from bson import ObjectId
from fastapi import APIRouter, HTTPException, Depends
from .models import Bid, User
from .database import get_database
from .oauth2 import get_current_user
from datetime import datetime, timedelta
import pytz

bid_router = APIRouter()

@bid_router.post("/items/{item_id}/bid/")
async def place_bid(item_id: str, bid: Bid, user: User = Depends(get_current_user)):
    print("Received bid data:", bid)  # Print incoming bid data for debugging
    db = await get_database()

    # Fetch the auction item to validate it exists
    item = await db.auction_items.find_one({"_id": ObjectId(item_id)})
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    # Validate the starting price and last bid
    last_bid = item['bids'][-1] if item['bids'] else None
    min_bid = item['starting_price'] if not last_bid else last_bid['amount']

    if bid.amount <= min_bid:
        raise HTTPException(status_code=400, detail=f"Bid must be greater than ${min_bid}")

    # Check if the auction is ongoing
    auction_end_time = item['auction_start_time'] + timedelta(minutes=item['duration'])
    now = datetime.now(pytz.UTC)
    if now > auction_end_time:
        raise HTTPException(status_code=400, detail="Auction has already ended")

    # Prepare the bid
    bid.timestamp = now  # Set the current time as the bid timestamp
    bid.user_id = user.username  # Use the authenticated user's username
    bid.username = user.username  # Include username in the bid
    bid.item_id = item_id  # Set the auction item ID

    # Store the bid in the item
    await db.auction_items.update_one(
        {"_id": ObjectId(item_id)},
        {"$push": {"bids": bid.dict()}}  # Store the bid in the item
    )
    return {"message": "Bid placed successfully"}