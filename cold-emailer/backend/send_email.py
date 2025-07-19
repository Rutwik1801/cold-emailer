import os
import smtplib
import requests
import fitz  # PyMuPDF
from email.message import EmailMessage
from google.oauth2 import service_account
from googleapiclient.discovery import build
from firebase_admin import credentials, firestore, initialize_app, storage as admin_storage
import openai
from datetime import datetime
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from starlette.responses import JSONResponse
from dotenv import load_dotenv
from pathlib import Path

# -------------------- Firebase Initialization --------------------
cred = credentials.Certificate("firebase-service-account.json")
initialize_app(cred, {
    'storageBucket': '<your-firebase-storage-bucket>.appspot.com'
})
db = firestore.client()

# -------------------- OpenAI Initialization --------------------

# -------------------- Email Sending Config --------------------
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
openai.api_key = os.getenv("OPENAI_API_KEY")

# -------------------- FastAPI App Setup --------------------
app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://cold-emailer-virid.vercel.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------- Resume Text Extraction --------------------
def extract_text_from_pdf_bytes(pdf_bytes):
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    return text.strip()

# -------------------- GPT-based Email Generator --------------------
def generate_email(company, recipient, user_name, resume_text, isFollowUp):
    prompt = f"""
    You are a helpful job-seeking assistant. Using the following resume content:

    {resume_text[:3000]}

    Write a short, polite ${'follow up to an earlier cold email' if isFollowUp else 'cold email'} to {recipient} at {company}, expressing interest in potential job opportunities. Sign off as {user_name}.
    """

    # response = openai.ChatCompletion.create(
    #     model="gpt-3.5-turbo",
    #     messages=[{"role": "user", "content": prompt}],
    #     temperature=0.7,
    #     max_tokens=300
    # )
    # return response.choices[0].message.content.strip()
    return "follow up helloooo" if isFollowUp else "helloooooo"

# -------------------- Download Resume from Firebase Storage --------------------
def download_resume(resume_url):
    response = requests.get(resume_url)
    if response.status_code == 200:
        return response.content
    else:
        raise Exception("Failed to download resume")

# -------------------- Send Email --------------------
def send_email(to_email, subject, body, resume_bytes, filename="resume.pdf"):
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = to_email
    msg.set_content(body)
    msg.add_attachment(resume_bytes, maintype='application', subtype='pdf', filename=filename)
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        smtp.send_message(msg)

# -------------------- Full Pipeline --------------------
def handle_outreach(entry_id, isFollowUp):
    doc = db.collection("outreach").document(entry_id).get()
    if not doc.exists:
        raise ValueError("Entry not found")
    data = doc.to_dict()
    company = data["company"]
    recipient = data["recipient"]
    to_email = data["email"]
    resume_url = data["resumeUrl"]
    # user_name = data.get("userName", "An applicant")
    resume_bytes = download_resume(resume_url)
    resume_text = extract_text_from_pdf_bytes(resume_bytes)
    email_body = generate_email(company, recipient, "rutwik", resume_text, isFollowUp)
    subject = f"Opportunity at {company}"
    send_email(to_email, subject, email_body, resume_bytes)
    db.collection("outreach").document(entry_id).update({
        "emailSent": True,
        "sentAt": datetime.utcnow().isoformat(),
        "emailContent": email_body
    })

    print("✅ Email sent successfully!")

# -------------------- Request Model --------------------
class EmailRequest(BaseModel):
    entryId: str
    isFollowUp: bool

# -------------------- HTTP Endpoint --------------------
@app.post("/send-email")
async def send_email_route(payload: EmailRequest):
    try:
        handle_outreach(payload.entryId, payload.isFollowUp)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

