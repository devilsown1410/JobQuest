import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

const Chat = ({ room, userId, recruiterUsername }) => {
  const recruiter = recruiterUsername;
  const user = JSON.parse(localStorage.getItem('user'));
  const username = user.username;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.emit('joinRoom', room);

    const handleMessage = (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    const handlePreviousMessages = (previousMessages) => {
      setMessages(previousMessages);
    };

    socket.on('message', handleMessage);
    socket.on('previousMessages', handlePreviousMessages);

    return () => {
      socket.off('message', handleMessage);
      socket.off('previousMessages', handlePreviousMessages);
    };
  }, [room]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      const data = { room, message, senderId: userId, username, timestamp: new Date() };
      socket.emit('message', data);
      setMessage('');
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex justify-center items-center">
      <div className="w-full max-w-md h-96 bg-white rounded-lg shadow-lg flex flex-col">
        <nav className="flex justify-between items-center bg-blue-600 text-white p-3 rounded-t-lg">
          <div className="flex items-center">
            <img src="https://i.imgur.com/IAgGUYF.jpg" className="rounded-full w-10 h-10 mr-3" alt="User " />
            <span className="text-lg font-semibold">{recruiter}</span>
          </div>
        </nav>
        <div className="flex-1 overflow-auto p-4">
          {messages.map((msg, index) => (
            <div key={index} className={`my-2 p-3 rounded-lg ${msg.senderId === userId ? 'bg-blue-100 self-end' : 'bg-gray-200 self-start'}`}>
              <strong className={`block ${msg.senderId === userId ? 'text-blue-600' : 'text-gray-800'}`}>
                {msg.senderId === userId ? 'You' : recruiter}:
              </strong>
              <span className="text-gray-700">{msg.message}</span>
              <span className="text-xs text-gray-500 block mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex p-3 border-t border-gray-300 bg-gray-50">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="ml-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;