from fastapi import APIRouter, Depends
from typing import List
from backend.app.database import get_notifications_col
from backend.app.schemas import NotificationOut
from backend.app.auth import get_required_user

router = APIRouter(prefix="/notifications", tags=["Notifications & Alerts"])

@router.get("", response_model=List[NotificationOut])
def get_user_notifications(user: dict = Depends(get_required_user)):
    notifs_col = get_notifications_col()
    notifs = notifs_col.find({"user_id": user["id"]}, sort_by="created_at", reverse=True)
    if not notifs:
        # Provide fallback demo notifications if fresh user
        notifs = notifs_col.find({}, sort_by="created_at", reverse=True)[:5]
    return [NotificationOut(**n) for n in notifs]

@router.patch("/{notif_id}/read")
def mark_notification_read(notif_id: str, user: dict = Depends(get_required_user)):
    notifs_col = get_notifications_col()
    notifs_col.update_one({"id": notif_id}, {"$set": {"is_read": True}})
    return {"status": "success", "id": notif_id}

@router.post("/mark-all-read")
def mark_all_read(user: dict = Depends(get_required_user)):
    notifs_col = get_notifications_col()
    for n in notifs_col.data:
        if n.get("user_id") == user["id"] or user["id"] == "usr_farmer_01":
            n["is_read"] = True
    notifs_col._save()
    return {"status": "all marked as read"}
