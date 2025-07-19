    export const sendEmail = async (entryId: string, isFollowUp=false) => {
        try {
            const res = await fetch(BACKEND_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ entryId, isFollowUp })
            });
            const result = await res.json();
            if (result.status === "success") {
                alert("✅ Email sent successfully!");
            } else {
                alert("❌ Failed to send email: " + result.message);

            }
        } catch (err) {
            console.error("Error:", err);
            alert("❌ Server error while sending email");
        }
    };

export const BACKEND_URL = "https://cold-emailer.onrender.com/send-email"
export const BACKEND_LOCAL_URL = "http://127.0.0.1:8000/send-email"