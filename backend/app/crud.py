# backend/app/crud.py
from bson import ObjectId
from fastapi import APIRouter, HTTPException, Depends
from .models import AuctionItem, User
from .database import get_database
from .oauth2 import get_current_user
from datetime import datetime, timedelta
import pytz

router = APIRouter()

# Function to ensure the datetime is timezone-aware
def ensure_utc_aware(dt: datetime) -> datetime:
    if dt.tzinfo is None:
        timezone = pytz.timezone('UTC')
        return timezone.localize(dt)
    return dt.astimezone(pytz.timezone('UTC'))

# Create product
@router.post("/items/")
async def create_auction_item(item: AuctionItem):
    db = await get_database()
    item_dict = item.dict()
    item_dict['auction_start_time'] = ensure_utc_aware(item_dict['auction_start_time'])
    result = await db.auction_items.insert_one(item_dict)
    return {"id": str(result.inserted_id)}

@router.put("/items/{item_id}")
async def update_auction_item(item_id: str, item: AuctionItem):
    db = await get_database()
    item_dict = item.dict()
    item_dict['auction_start_time'] = ensure_utc_aware(item_dict['auction_start_time'])
    result = await db.auction_items.update_one({"_id": ObjectId(item_id)}, {"$set": item_dict})
    if result.modified_count == 1:
        return {"message": "Product updated successfully"}
    raise HTTPException(status_code=404, detail="Product not found")

# Read products
@router.get("/items/")
async def read_auction_items():
    db = await get_database()
    items = []
    async for item in db.auction_items.find():
        item["id"] = str(item["_id"])
        del item["_id"]
        items.append(item)
    return items

@router.get("/items/{item_id}")
async def get_auction_item(item_id: str):
    db = await get_database()
    item = await db.auction_items.find_one({"_id": ObjectId(item_id)})
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    # Convert the item to a format suitable for frontend
    item['id'] = str(item['_id'])
    del item['_id']
    return item

# Delete product
@router.delete("/items/{item_id}")
async def delete_item(item_id: str):
    db = await get_database()
    if not ObjectId.is_valid(item_id):
        raise HTTPException(status_code=400, detail="Invalid item ID format")
    
    result = await db.auction_items.delete_one({"_id": ObjectId(item_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    
    return {"message": "Item deleted successfully"}
