import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { onAuthStateChanged, type User } from 'firebase/auth';

import { auth } from './store/firebase';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import AddEntry from './pages/AddEntry';

function App() {
  const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);


  useEffect(() => {

    const unsub = onAuthStateChanged(auth, (user) => {

       setUser(user);
       setLoading(false)
      return
    });
    return unsub;
  }, []);

if(loading) return <div>Loading</div>
  return (
    <Router>
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
<Route
  path="/login"
  element={!user ? <Login /> : <Navigate to="/" replace />}
/>
<Route
  path="/add-entry"
  element={ <AddEntry />}
/>
      </Routes>
    </Router>
  );
}

export default App;