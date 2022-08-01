import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import Message from '../components/Message';
import MessageForm from '../components/MessageForm';
import User from '../components/User';
import { db, auth, storage } from '../firebase';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState('');
  const [text, setText] = useState('');
  const [img, setImg] = useState('');
  const [msgs, setMsgs] = useState([]);

  const user1 = auth.currentUser.uid;

  useEffect(() => {
    const usersRef = collection(db, 'users');
    // not-in 쿼리는 주어진 필드가 존재하지 않는 문서
    const q = query(usersRef, where('uid', 'not-in', [user1]));
    const unsub = onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUsers(users);
    });
    return () => unsub();
  }, [user1]);

  const selectUser = async (user) => {
    setChat(user);

    const user2 = user.uid;
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

    const msgsRef = collection(db, 'messages', id, 'chat');
    const q = query(msgsRef, orderBy('createdAt', 'asc'));

    onSnapshot(q, (querySnapshot) => {
      let msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data());
      });
      setMsgs(msgs);
    });
    // 채팅할 사람을 클릭했을 때 마지막 메세지를 가져오기
    const docSnap = await getDoc(doc(db, 'lastMsg', id));
    // 마지막 메세지가 상대방이 보낸거면 읽음으로 업데이트 하기
    if (docSnap.data() && docSnap.data().from !== user1) {
      await updateDoc(doc(db, 'lastMsg', id), { unread: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user2 = chat.uid;

    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

    let url;
    if (img) {
      const imgRef = ref(
        storage,
        `images/${new Date().getTime()} - ${img.name}`
      );
      const snap = await uploadBytes(imgRef, img);
      url = await getDownloadURL(ref(storage, snap.ref.fullPath));
    }

    await addDoc(collection(db, 'messages', id, 'chat'), {
      text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || '',
    }); // chat : sub collection

    await setDoc(doc(db, 'lastMsg', id), {
      text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || '',
      unread: true,
    });
    setText('');
    setImg('');
  };

  return (
    <div className='home_container'>
      <div className='users_container'>
        {users.map((user) => (
          <User
            key={user.uid}
            user={user}
            selectUser={selectUser}
            user1={user1}
            chat={chat}
          />
        ))}
      </div>
      <div className='messages_container'>
        {chat ? (
          <>
            <div className='messages_user'>
              <h3>{chat.name}</h3>
            </div>
            <div className='messages'>
              {msgs.length
                ? msgs.map((msg, i) => (
                    <Message key={i} msg={msg} user1={user1} chat={chat} />
                  ))
                : null}
            </div>
            <MessageForm
              handleSubmit={handleSubmit}
              text={text}
              setText={setText}
              setImg={setImg}
            />
          </>
        ) : (
          <h3 className='no_conv'>Select a user to start conversation</h3>
        )}
      </div>
    </div>
  );
};

export default Home;
