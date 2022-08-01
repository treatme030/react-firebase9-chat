import React, { useEffect, useRef } from 'react';
import Moment from 'react-moment';

const Message = ({ msg, user1, chat }) => {
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msg]);

  return (
    <div className='box'>
      {msg.from !== user1 && (
        <img src={chat.avatar} alt='avatar' className='avatar' />
      )}

      <div
        className={`message_wrapper ${msg.from === user1 ? 'own' : ''}`}
        ref={scrollRef}
      >
        {msg.from !== user1 && <span>{chat.name}</span>}

        <div>
          <p className={msg.from === user1 ? 'me' : 'friend'}>
            {msg.media && <img src={msg.media} alt={msg.text} />}
            {msg.text}
            <br />
            <small>
              <Moment fromNow>{msg.createdAt.toDate()}</Moment>
            </small>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Message;
