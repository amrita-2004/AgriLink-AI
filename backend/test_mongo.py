import os
import sys
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

def test_mongo(uri: str = None):
    target_uri = uri or os.getenv("MONGODB_URI")
    if not target_uri:
        print("❌ No MONGODB_URI found.")
        print("Usage: python backend/test_mongo.py \"mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/\"")
        return False

    print(f"🔄 Testing connection to MongoDB...")
    try:
        client = MongoClient(target_uri, serverSelectionTimeoutMS=5000)
        client.admin.command('ping')
        dbs = client.list_database_names()
        print(f"✅ SUCCESS: Connected to MongoDB successfully!")
        print(f"📊 Available Databases: {dbs}")
        return True
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return False

if __name__ == "__main__":
    uri_arg = sys.argv[1] if len(sys.argv) > 1 else None
    test_mongo(uri_arg)
