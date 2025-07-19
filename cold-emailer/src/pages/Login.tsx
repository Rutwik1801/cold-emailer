import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../store/firebase';
import {  useNavigate } from 'react-router-dom';
import { setPersistence, browserLocalPersistence } from "firebase/auth";

export default function Login() {
      const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await setPersistence(auth, browserLocalPersistence);
     const res = await signInWithPopup(auth, provider);
     if(res) {

       navigate("/")    
     }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-2xl mb-4">Sign In to Job Outreach Tool</h1>
      <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">
        Sign in with Google
      </button>
    </div>
  );
}