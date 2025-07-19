import { signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { auth } from '../store/firebase';

const Navbar = () => {
  const navStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '60px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    zIndex: 1000,
  };

  const brandStyle = {
    fontSize: '20px',
    fontWeight: '500',
    fontFamily: "cursive",
    color: '#333',
    textDecoration: 'none',
  };

  const linkContainerStyle = {
    alignItems: "center",
    display: 'flex',
    gap: '20px',
  };

  const linkStyle = {
    textDecoration: 'none',
    color: '#555',
    fontWeight: '400',
  };

  return (
    <>
      <nav style={navStyle as any}>
        <Link to="/" style={brandStyle}>Outreach</Link>
        <div style={linkContainerStyle}>
          <Link to="/profile" style={linkStyle}>Profile</Link>
          <Link to="/" style={linkStyle}>Dashboard</Link>
          <Link to="/add-entry" style={linkStyle}>Add Entry</Link>
                  <button style={{backgroundColor:"white", color:"black", border:"1px solid black", fontSize:"12px"}} onClick={() => {
                    localStorage.removeItem("user")
                    signOut(auth)}} className="bg-red-500 text-white px-2 py-1 rounded">
                    Sign Out
                  </button>
        </div>
      </nav>
      <div style={{ height: '60px' }} />
    </>
  );
};

export default Navbar;
