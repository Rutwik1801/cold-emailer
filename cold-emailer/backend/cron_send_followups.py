from datetime import datetime, timedelta
import firebase_admin
from firebase_admin import credentials, firestore
import requests

cred = credentials.Certificate("firebase-service-account.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

def send_followup(entry_id):
    url = "http://localhost:5000/send-email"
    response = requests.post(url, json={"entryId": entry_id, "isFollowUp": True})
    return response.ok

def is_followup_due(entry):
    last_sent = entry.get("lastEmailSentAt")
    days = entry.get("followUpAfterDays")

    if not last_sent or not days:
        return False

    sent_date = last_sent.replace(tzinfo=None)
    return datetime.utcnow().date() >= (sent_date + timedelta(days=days)).date()

def main():
    docs = db.collection("outreach").stream()
    for doc in docs:
        data = doc.to_dict()
        if is_followup_due(data):
            success = send_followup(doc.id)
            if success:
                print(f"Follow-up sent for {doc.id}")
            else:
                print(f"Failed to send for {doc.id}")

if __name__ == "__main__":
    main()
