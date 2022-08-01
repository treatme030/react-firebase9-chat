import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import User from '../components/User';
import { db, auth } from '../firebase';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState('');

  useEffect(() => {
    // Create a reference to the cities collection
    const usersRef = collection(db, 'users');
    // Create a query against the collection.
    // not-in 쿼리는 주어진 필드가 존재하지 않는 문서
    const q = query(usersRef, where('uid', 'not-in', [auth.currentUser.uid]));
    const unsub = onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUsers(users);
    });
    return () => unsub();
  }, []);

  const selectUser = (user) => {
    setChat(user);
  };

  return (
    <div className='home_container'>
      <div className='users_container'>
        {users.map((user) => (
          <User key={user.uid} user={user} selectUser={selectUser} />
        ))}
      </div>
      <div className='messages_container'>
        {chat ? (
          <div className='messages_user'>
            <h3>{chat.name}</h3>
          </div>
        ) : (
          <h3 className='no_conv'>Select a user to start conversation</h3>
        )}
      </div>
    </div>
  );
};

export default Home;
