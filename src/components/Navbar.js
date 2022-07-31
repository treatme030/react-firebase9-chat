import { signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import { auth, db } from '../firebase';

const Navbar = () => {
  const history = useHistory();
  const { currentUser } = useContext(AuthContext);

  const handleSignout = async () => {
    await updateDoc(doc(db, 'users', auth.currentUser.uid), {
      isOnline: false,
    });
    await signOut(auth);
    history.replace('/login');
  };

  return (
    <nav>
      <h3>
        <Link to='/'>Messenger</Link>
      </h3>
      <div>
        {currentUser ? (
          <>
            <Link to='/profile'>Profile</Link>
            <button className='btn' onClick={handleSignout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to='/register'>Register</Link>
            <Link to='/login'>Login</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
