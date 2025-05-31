from pymongo import MongoClient
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["dhaba_bill_buddy"]
menu_collection = db['menu_items']

# Sample menu items
sample_menu_items = [
    {
        "id": "C001",
        "name": "Butter Chicken",
        "price": 250,
        "category": "Main Course",
        "description": "Tender chicken in a rich, creamy tomato-based curry"
    },
    {
        "id": "C002",
        "name": "Paneer Butter Masala",
        "price": 220,
        "category": "Main Course",
        "description": "Cottage cheese in a rich, creamy tomato-based curry"
    },
    {
        "id": "C003",
        "name": "Veg Biryani",
        "price": 180,
        "category": "Rice",
        "description": "Fragrant basmati rice cooked with mixed vegetables and spices"
    },
    {
        "id": "C004",
        "name": "Naan",
        "price": 30,
        "category": "Bread",
        "description": "Soft, fluffy flatbread baked in tandoor"
    },
    {
        "id": "C005",
        "name": "Lassi",
        "price": 60,
        "category": "Beverages",
        "description": "Sweet yogurt drink"
    }
]

def init_db():
    try:
        # Clear existing menu items
        menu_collection.delete_many({})
        logger.info("Cleared existing menu items")

        # Insert sample menu items
        result = menu_collection.insert_many(sample_menu_items)
        logger.info(f"Successfully inserted {len(result.inserted_ids)} menu items")

        # Verify the insertion
        count = menu_collection.count_documents({})
        logger.info(f"Total menu items in database: {count}")

    except Exception as e:
        logger.error(f"Error initializing database: {str(e)}")
        raise

if __name__ == "__main__":
    init_db() 