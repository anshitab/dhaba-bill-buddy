from flask import Flask, request, jsonify, send_file, Response
from flask_cors import CORS
from pymongo import MongoClient
import os
import logging
from datetime import datetime, timedelta
from bson import json_util
import json
import csv
from io import StringIO
import socket
import time

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Enable CORS for all routes
CORS(app, supports_credentials=True, resources={
    r"/*": {
        "origins": ["http://localhost:*", "http://127.0.0.1:*"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Content-Type"],
        "supports_credentials": True
    }
})

# Hardcoded admin credentials
ADMIN_USERNAME = "aarkay"
ADMIN_PASSWORD = "aarkay123"

# Connect to MongoDB
try:
    client = MongoClient("mongodb://localhost:27017/")
    db = client["dhaba_bill_buddy"]
    menu_collection = db['menu_items']
    transactions_collection = db['transactions']
    logger.info("Successfully connected to MongoDB")
except Exception as e:
    logger.error(f"Failed to connect to MongoDB: {str(e)}")
    raise

def initialize_menu_items():
    """Initialize the menu with some default items if none exist"""
    if menu_collection.count_documents({}) == 0:
        default_items = [
            {
                "item_id": "ITEM001",
                "name": "Butter Chicken",
                "price": 250,
                "category": "Main Course",
                "description": "Tender chicken in a rich, creamy tomato-based curry"
            },
            {
                "item_id": "ITEM002",
                "name": "Naan",
                "price": 30,
                "category": "Bread",
                "description": "Soft, fluffy Indian bread"
            },
            {
                "item_id": "ITEM003",
                "name": "Masala Chai",
                "price": 20,
                "category": "Beverages",
                "description": "Spiced Indian tea"
            }
        ]
        try:
            menu_collection.insert_many(default_items)
            logger.info("Added default menu items")
        except Exception as e:
            logger.error(f"Error adding default menu items: {str(e)}")

# Initialize menu items when the app starts
initialize_menu_items()

@app.route("/", methods=["GET"])
def root():
    logger.info("Root endpoint accessed")
    return jsonify({
        "message": "Welcome to Dhaba Bill Buddy API",
        "endpoints": {
            "GET /menu": "Get all menu items",
            "POST /menu/add": "Add a new menu item",
            "PUT /menu/edit/<item_id>": "Edit a menu item",
            "DELETE /menu/delete/<item_id>": "Delete a menu item",
            "POST /transactions": "Add a new transaction",
            "GET /transactions/today": "Get today's transactions",
            "POST /admin/login": "Admin login"
        }
    })

@app.route("/admin/login", methods=["POST", "OPTIONS"])
def admin_login():
    if request.method == "OPTIONS":
        logger.info("Received OPTIONS request for login")
        return "", 200
        
    logger.info("Login attempt received")
    logger.info(f"Request headers: {dict(request.headers)}")
    logger.info(f"Request data: {request.get_data()}")
    
    try:
        data = request.json
        logger.info(f"Parsed login data: {data}")
        
        if not data:
            logger.error("No JSON data received")
            return jsonify({"message": "No data received"}), 400
            
        if "username" not in data or "password" not in data:
            logger.error(f"Missing credentials. Received data: {data}")
            return jsonify({"message": "Missing username or password"}), 400
            
        # Log the exact comparison
        username_match = data["username"] == ADMIN_USERNAME
        password_match = data["password"] == ADMIN_PASSWORD
        logger.info(f"Username match: {username_match}, Password match: {password_match}")
        logger.info(f"Received - Username: '{data['username']}', Password: '{data['password']}'")
        logger.info(f"Expected - Username: '{ADMIN_USERNAME}', Password: '{ADMIN_PASSWORD}'")
        
        if username_match and password_match:
            logger.info("Login successful")
            return jsonify({"success": True, "message": "Login successful"}), 200
            
        logger.error("Invalid credentials provided")
        return jsonify({"success": False, "message": "Invalid credentials!"}), 401
        
    except Exception as e:
        logger.error(f"Error during login: {str(e)}")
        return jsonify({"success": False, "message": f"Login error: {str(e)}"}), 500

@app.route("/test", methods=["GET", "OPTIONS"])
def test():
    if request.method == "OPTIONS":
        return "", 200
        
    return jsonify({
        "status": "ok",
        "message": "Server is running",
        "admin_username": ADMIN_USERNAME,
        "admin_password": ADMIN_PASSWORD
    })

@app.route("/menu", methods=["GET"])
def get_menu():
    try:
        logger.info("Fetching menu items")
        items = list(menu_collection.find())
        items = json.loads(json_util.dumps(items))
        logger.info(f"Retrieved {len(items)} menu items")
        return jsonify(items)
    except Exception as e:
        logger.error(f"Error retrieving menu items: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/menu/add", methods=["POST"])
def add_menu_item():
    try:
        data = request.json
        logger.info(f"Received menu item data: {data}")
        
        if 'item_id' not in data:
            data['item_id'] = f"ITEM{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        menu_collection.insert_one(data)
        logger.info("Menu item saved to MongoDB successfully")
        return jsonify({"message": "Menu item added successfully"}), 201
    except Exception as e:
        logger.error(f"Error saving menu item to MongoDB: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/menu/edit/<item_id>", methods=["PUT"])
def edit_menu_item(item_id):
    try:
        data = request.json
        logger.info(f"Updating menu item {item_id} with data: {data}")
        result = menu_collection.update_one({"item_id": item_id}, {"$set": data})
        if result.modified_count == 0:
            return jsonify({"error": "Menu item not found"}), 404
        logger.info("Menu item updated successfully")
        return jsonify({"message": "Menu item updated successfully"}), 200
    except Exception as e:
        logger.error(f"Error updating menu item: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/menu/delete/<item_id>", methods=["DELETE"])
def delete_menu_item(item_id):
    try:
        logger.info(f"Deleting menu item {item_id}")
        result = menu_collection.delete_one({"item_id": item_id})
        if result.deleted_count == 0:
            return jsonify({"error": "Menu item not found"}), 404
        logger.info("Menu item deleted successfully")
        return jsonify({"message": "Menu item deleted successfully"}), 200
    except Exception as e:
        logger.error(f"Error deleting menu item: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/transactions", methods=["GET", "POST", "OPTIONS"])
def handle_transactions():
    if request.method == "OPTIONS":
        return "", 200
        
    if request.method == "POST":
        try:
            data = request.json
            logger.info(f"Received transaction data: {data}")
            
            # Generate a visible transaction ID
            timestamp = datetime.now()
            transaction_id = f"TXN{timestamp.strftime('%Y%m%d%H%M%S')}"
            data['transaction_id'] = transaction_id
            data['timestamp'] = timestamp
            
            result = transactions_collection.insert_one(data)
            logger.info("Transaction saved to MongoDB successfully")
            
            inserted_transaction = transactions_collection.find_one({"_id": result.inserted_id})
            inserted_transaction = json.loads(json_util.dumps(inserted_transaction))
            
            return jsonify({
                "message": "Transaction saved successfully",
                "transaction": inserted_transaction
            }), 201
        except Exception as e:
            logger.error(f"Error saving transaction to MongoDB: {str(e)}")
            return jsonify({"error": str(e)}), 500
    else:  # GET request
        try:
            start_date = request.args.get('start_date')
            end_date = request.args.get('end_date')
            
            query = {}
            if start_date and end_date:
                start = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
                end = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
                query["timestamp"] = {
                    "$gte": start,
                    "$lte": end
                }
            
            transactions = list(transactions_collection.find(query).sort("timestamp", -1))
            transactions = json.loads(json_util.dumps(transactions))
            logger.info(f"Retrieved {len(transactions)} transactions")
            return jsonify(transactions)
        except Exception as e:
            logger.error(f"Error retrieving transactions: {str(e)}")
            return jsonify({"error": str(e)}), 500

@app.route("/transactions/today", methods=["GET"])
def get_todays_transactions():
    try:
        today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        logger.info("Fetching today's transactions")
        transactions = list(transactions_collection.find({"timestamp": {"$gte": today}}).sort("timestamp", -1))
        transactions = json.loads(json_util.dumps(transactions))
        logger.info(f"Retrieved {len(transactions)} transactions for today")
        return jsonify(transactions)
    except Exception as e:
        logger.error(f"Error retrieving today's transactions: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/transactions/today/csv", methods=["GET"])
def export_todays_transactions_csv():
    try:
        # Get today's start and end timestamps
        today_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        today_end = today_start + timedelta(days=1)
        
        # Query transactions for today
        transactions = list(transactions_collection.find({
            "timestamp": {
                "$gte": today_start,
                "$lt": today_end
            }
        }))
        
        if not transactions:
            return jsonify({"error": "No transactions found for today"}), 404
            
        # Create CSV in memory
        output = StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow([
            "Transaction ID",
            "Timestamp",
            "Items",
            "Total Amount",
            "Payment Method"
        ])
        
        # Write data rows
        for transaction in transactions:
            items_str = ", ".join([f"{item['name']} (₹{item['price']})" for item in transaction.get('items', [])])
            writer.writerow([
                str(transaction.get('_id', '')),
                transaction.get('timestamp', '').strftime('%Y-%m-%d %H:%M:%S'),
                items_str,
                f"₹{transaction.get('total_amount', 0)}",
                transaction.get('payment_method', 'Cash')
            ])
        
        # Prepare response
        output.seek(0)
        return Response(
            output.getvalue(),
            mimetype="text/csv",
            headers={
                "Content-Disposition": f"attachment; filename=transactions_{today_start.strftime('%Y-%m-%d')}.csv"
            }
        )
        
    except Exception as e:
        logger.error(f"Error exporting transactions to CSV: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.errorhandler(404)
def not_found(error):
    logger.warning(f"404 error: {request.url}")
    return jsonify({
        "error": "Not Found",
        "message": "The requested URL was not found on the server",
        "available_endpoints": {
            "GET /": "API documentation",
            "GET /menu": "Get all menu items",
            "POST /menu/add": "Add a new menu item",
            "PUT /menu/edit/<item_id>": "Edit a menu item",
            "DELETE /menu/delete/<item_id>": "Delete a menu item",
            "POST /transactions": "Add a new transaction",
            "GET /transactions/today": "Get today's transactions",
            "POST /admin/login": "Admin login"
        }
    }), 404

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"500 error: {str(error)}")
    return jsonify({
        "error": "Internal Server Error",
        "message": "An unexpected error occurred"
    }), 500

def is_port_in_use(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('127.0.0.1', port)) == 0

if __name__ == "__main__":
    try:
        logger.info("Starting Flask server on port 5000")
        app.run(debug=True, port=5000, host='127.0.0.1')
    except Exception as e:
        logger.error(f"Failed to start server: {str(e)}")
