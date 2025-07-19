import { useEffect, useState } from 'react';
import { db, storage, auth } from '../store/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, listAll, getDownloadURL } from 'firebase/storage';
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { Input } from '../components/Input';
import { sendEmail } from '../utils';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router';

ModuleRegistry.registerModules([AllCommunityModule]);

export default function AddEntry() {
    const [newEntry, setNewEntry] = useState({});
    const [resumes, setResumes] = useState<string[]>([]);
    const [disableResumeAddition, setDisableResumeAddition] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        const listRef = ref(storage, `resumes/${auth.currentUser?.uid}`);
        const files = await listAll(listRef);
        const urls = await Promise.all(files.items.map(item => getDownloadURL(item)));
        setResumes(urls);
        setDisableResumeAddition(urls.length > 1);
    };

    const handleUploadResume = async (e: any) => {
        const file = e.target.files[0];
        const fileRef = ref(storage, `resumes/${auth.currentUser?.uid}/${file.name}`);
        await uploadBytes(fileRef, file);
        fetchResumes();
    };

    const handleAddEntry = async () => {
        const docRef = await addDoc(collection(db, 'outreach'), {
            ...newEntry,
            userId: auth.currentUser?.uid,
            timestamp: new Date().toISOString(),
        });
        toast.info("Sending an Email...")
        try {
            navigate("/")
            await sendEmail(docRef.id);
            toast.success("Email Successfully Sent!")
        } catch (e) {
            toast.error("Error Sending Email")
        }
    };

    return (
        <>
            <div style={styles.container as any}>
                <p style={styles.heading as any}>Add New Outreach</p>
                <div>
                    <Input label="Company" placeholder="eg OpenAI" onChange={(e) => setNewEntry({ ...newEntry, company: e })} />
                    <Input label="Recipient Name" placeholder="eg Sam Altman" onChange={(e) => setNewEntry({ ...newEntry, recipient: e })} />
                    <Input label="Recipient Email" placeholder="e.g. sam@openai.com" onChange={(e) => setNewEntry({ ...newEntry, email: e })} />
                    <Input label="Follow-up After (days)" placeholder="e.g. 2" onChange={(e) => setNewEntry({ ...newEntry, followUpAfterDays: e })} />
                    <Input
                        isSelect={true}
                        label="Resume"
                        placeholder="Select resume"
                        options={resumes.map((url, i) => (
                            <option key={i} value={url}>{`Resume ${i + 1}`}</option>
                        ))}
                        onChange={(e) => setNewEntry({ ...newEntry, resumeUrl: e })}
                    />
                </div>

                {!disableResumeAddition && (
                    <div>
                        <label>📄 Upload A New Resume (PDF only)</label>
                        <input disabled={disableResumeAddition} type="file" accept="application/pdf" onChange={handleUploadResume} />
                        <p style={styles.note}>* Note:- Maximum 2 resumes allowed per user.</p>
                    </div>
                )}
                <div style={styles.buttonContainer}>
                    <button style={styles.button} onClick={handleAddEntry}>Send Email</button>
                </div>
            </div>
            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} />
        </>
    );
}

const styles = {
    container: {
        minWidth: "550px",
        position: "absolute",
        top: "55%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: "24px",
        borderRadius: "16px",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.2)",
        color: "#fff",
    },
    heading: {
        textAlign: "center",
        fontWeight: "400",
        fontSize: "18px",
        letterSpacing: "1px",
    },
    note: {
        fontSize: "12px",
    },
    buttonContainer: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        marginTop: "12px",
    },
    button: {
        fontWeight: "200",
        padding: "10px 20px",
        borderRadius: "8px",
        border: "none",
        backgroundColor: "#ffffff22",
        color: "#fff",
        cursor: "pointer",
    },
};
