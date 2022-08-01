import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import Img from '../images/default.jpeg';

const User = ({ user, selectUser, user1, chat }) => {
  const [data, setData] = useState('');
  const user2 = user?.uid;

  useEffect(() => {
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    let unsub = onSnapshot(doc(db, 'lastMsg', id), (doc) => {
      setData(doc.data());
    });
    return () => unsub();
  }, [user1, user2]);

  return (
    <>
      <div
        className={`user_wrapper ${chat.name === user.name && 'selected_user'}`}
        onClick={() => selectUser(user)}
      >
        <div className='user_info'>
          <div className='user_detail'>
            <img src={user.avatar || Img} alt='avatar' className='avatar' />
            <h4>{user.name}</h4>
            {data?.from !== user1 && data?.unread && (
              <small className='unread'>New</small>
            )}
          </div>
          <div
            className={`user_status ${user.isOnline ? 'online' : 'offline'}`}
          ></div>
        </div>
        {data && (
          <p className='truncate'>
            <strong>{data.from === user1 ? 'Me:' : null}</strong>
            {data.text}
          </p>
        )}
      </div>
      <div
        onClick={() => selectUser(user)}
        className={`sm_container ${chat.name === user.name && 'selected_user'}`}
      >
        <img
          src={user.avatar || Img}
          alt='avatar'
          className='avatar sm_screen'
        />
      </div>
    </>
  );
};

export default User;
