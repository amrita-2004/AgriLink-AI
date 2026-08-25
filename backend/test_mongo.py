import os
import sys
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

def test_mongo(uri: str = None):
    target_uri = uri or os.getenv("MONGODB_URI")
    if not target_uri:
        print("[ERROR] No MONGODB_URI found.")
        return False

    print("[INFO] Testing connection to MongoDB Atlas cluster...")
    try:
        client = MongoClient(target_uri, serverSelectionTimeoutMS=5000)
        client.admin.command('ping')
        dbs = client.list_database_names()
        print("[SUCCESS] Connected to MongoDB Atlas successfully!")
        print(f"[INFO] Available Databases on Cluster: {dbs}")
        return True
    except Exception as e:
        print(f"[ERROR] Connection failed: {e}")
        return False

if __name__ == "__main__":
    uri_arg = sys.argv[1] if len(sys.argv) > 1 else None
    test_mongo(uri_arg)
