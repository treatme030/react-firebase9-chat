import { doc, getDoc, updateDoc } from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Camera from '../components/svg/Camera';
import Delete from '../components/svg/Delete';
import { auth, db, storage } from '../firebase';
import Img from '../images/default.jpeg';

const Profile = () => {
  const [img, setImg] = useState('');
  const [user, setUser] = useState();
  const history = useHistory();

  useEffect(() => {
    getDoc(doc(db, 'users', auth.currentUser.uid)).then((docSnap) => {
      if (docSnap.exists()) {
        setUser(docSnap.data());
      }
    });
    if (img) {
      const uploadImg = async () => {
        const imgRef = ref(
          storage,
          `avatar/${new Date().getTime()} - ${img.name}`
        );
        try {
          if (user?.avatarPath) {
            await deleteObject(ref(storage, user.avatarPath));
          }
          const snap = await uploadBytes(imgRef, img);
          const url = await getDownloadURL(ref(storage, snap.ref.fullPath));
          //snap.ref.fullPath => avatar/1659322385082 - 55.png

          await updateDoc(doc(db, 'users', auth.currentUser.uid), {
            avatar: url,
            avatarPath: snap.ref.fullPath,
          });
          setImg('');
        } catch (err) {
          console.log(err.message);
        }
      };
      uploadImg();
    }
  }, [img, user?.avatarPath]);

  const deleteImage = async () => {
    try {
      const confirm = window.confirm('Delete avatar?');
      if (confirm) {
        await deleteObject(ref(storage, user.avatarPath));

        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
          avatar: '',
          avatarPath: '',
        });
        history.replace('/');
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    user && (
      <section>
        <div className='profile_container'>
          <div className='img_container'>
            <img src={user.avatar || Img} alt='avatar' />
            <div className='overlay'>
              <div>
                <label htmlFor='photo'>
                  <Camera />
                </label>
                {user.avatar && <Delete deleteImage={deleteImage} />}
                <input
                  type='file'
                  accept='image/*'
                  style={{ display: 'none' }}
                  id='photo'
                  onChange={(e) => setImg(e.target.files[0])}
                />
              </div>
            </div>
          </div>
          <div className='text_container'>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <hr />
            <small>Joined on: {user.createdAt.toDate().toDateString()}</small>
          </div>
        </div>
      </section>
    )
  );
};

export default Profile;
