import React, { useEffect, useRef } from 'react';
import Moment from 'react-moment';
import Img from '../images/default.jpeg';

const Message = ({ msg, user1, chat }) => {
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msg]);

  return (
    <div className='message'>
      {msg.from !== user1 ? (
        <>
          <img src={chat.avatar || Img} alt='avatar' className='avatar' />
          <div className='message_wrapper' ref={scrollRef}>
            <span>{chat.name}</span>
            <div>
              <p className='friend'>
                {msg.media && <img src={msg.media} alt={msg.text} />}
                {msg.text}
                <br />
                <small>
                  <Moment fromNow>{msg.createdAt.toDate()}</Moment>
                </small>
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className='message_wrapper own' ref={scrollRef}>
            <div>
              <p className='me'>
                {msg.media && <img src={msg.media} alt={msg.text} />}
                {msg.text}
                <br />
                <small>
                  <Moment fromNow>{msg.createdAt.toDate()}</Moment>
                </small>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Message;
