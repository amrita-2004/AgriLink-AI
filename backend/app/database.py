import os
import json
import uuid
from datetime import datetime
from typing import Dict, List, Any, Optional
from backend.app.config import settings

class LocalCollection:
    def __init__(self, name: str, data_dir: str):
        self.name = name
        self.file_path = os.path.join(data_dir, f"{name}.json")
        self._load()

    def _load(self):
        if os.path.exists(self.file_path):
            try:
                with open(self.file_path, "r", encoding="utf-8") as f:
                    self.data: List[Dict[str, Any]] = json.load(f)
            except Exception:
                self.data = []
        else:
            self.data = []

    def _save(self):
        with open(self.file_path, "w", encoding="utf-8") as f:
            json.dump(self.data, f, indent=2, default=str)

    def find(self, query: Optional[Dict[str, Any]] = None, sort_by: Optional[str] = None, reverse: bool = False) -> List[Dict[str, Any]]:
        self._load()
        if not query:
            results = list(self.data)
        else:
            results = []
            for doc in self.data:
                match = True
                for k, v in query.items():
                    if isinstance(v, dict):
                        # Simple operator support like $in, $gte, $lte, $regex
                        if "$in" in v and doc.get(k) not in v["$in"]:
                            match = False
                            break
                        if "$gte" in v and doc.get(k, 0) < v["$gte"]:
                            match = False
                            break
                        if "$lte" in v and doc.get(k, 0) > v["$lte"]:
                            match = False
                            break
                        if "$regex" in v and v["$regex"].lower() not in str(doc.get(k, "")).lower():
                            match = False
                            break
                    elif doc.get(k) != v:
                        match = False
                        break
                if match:
                    results.append(doc)

        if sort_by:
            results.sort(key=lambda x: x.get(sort_by, ""), reverse=reverse)
        return results

    def find_one(self, query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        results = self.find(query)
        return results[0] if results else None

    def insert_one(self, doc: Dict[str, Any]) -> Dict[str, Any]:
        self._load()
        if "id" not in doc and "_id" not in doc:
            doc["id"] = str(uuid.uuid4())
        elif "_id" in doc and "id" not in doc:
            doc["id"] = str(doc["_id"])
        
        if "created_at" not in doc:
            doc["created_at"] = datetime.utcnow().isoformat()
        if "updated_at" not in doc:
            doc["updated_at"] = datetime.utcnow().isoformat()

        self.data.append(doc)
        self._save()
        return doc

    def update_one(self, query: Dict[str, Any], update: Dict[str, Any]) -> bool:
        self._load()
        for idx, doc in enumerate(self.data):
            match = True
            for k, v in query.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                set_fields = update.get("$set", update)
                self.data[idx].update(set_fields)
                self.data[idx]["updated_at"] = datetime.utcnow().isoformat()
                self._save()
                return True
        return False

    def delete_one(self, query: Dict[str, Any]) -> bool:
        self._load()
        for idx, doc in enumerate(self.data):
            match = True
            for k, v in query.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                self.data.pop(idx)
                self._save()
                return True
        return False

    def count_documents(self, query: Optional[Dict[str, Any]] = None) -> int:
        return len(self.find(query))


class DatabaseManager:
    def __init__(self):
        self.use_mongo = False
        self.mongo_client = None
        self.mongo_db = None
        self.collections: Dict[str, Any] = {}

        if settings.MONGODB_URI:
            try:
                from pymongo import MongoClient
                self.mongo_client = MongoClient(settings.MONGODB_URI, serverSelectionTimeoutMS=2000)
                # Test connection
                self.mongo_client.server_info()
                self.mongo_db = self.mongo_client[settings.DATABASE_NAME]
                self.use_mongo = True
                print(" Connected to MongoDB successfully!")
            except Exception as e:
                print(f" MongoDB connection failed ({e}). Falling back to local high-performance document store.")
                self.use_mongo = False
        else:
            print(" Using local document store (data/ directory). Set MONGODB_URI to connect to live MongoDB instance.")

    def get_collection(self, name: str):
        if self.use_mongo and self.mongo_db is not None:
            return self.mongo_db[name]
        if name not in self.collections:
            self.collections[name] = LocalCollection(name, settings.DATA_DIR)
        return self.collections[name]

db = DatabaseManager()

# Collections
def get_users_col(): return db.get_collection("users")
def get_products_col(): return db.get_collection("products")
def get_orders_col(): return db.get_collection("orders")
def get_deliveries_col(): return db.get_collection("deliveries")
def get_reviews_col(): return db.get_collection("reviews")
def get_notifications_col(): return db.get_collection("notifications")
def get_disputes_col(): return db.get_collection("disputes")
