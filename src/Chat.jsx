import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { auth, db } from './firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';

function Chat() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const messagesEndRef = useRef();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!currentUser) return;
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const list = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(u => u.uid !== currentUser.uid);
      setUsers(list);
    });
    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser || !selectedUser) return;

    const chatId = [currentUser.uid, selectedUser.uid].sort().join('_');
    const msgQuery = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(msgQuery, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [currentUser, selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const chatId = [currentUser.uid, selectedUser.uid].sort().join('_');

    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      senderId: currentUser.uid,
      receiverId: selectedUser.uid,
      text: message,
      timestamp: serverTimestamp(),
    });

    setMessage('');
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to log out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#06b6d4',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout',
    }).then((result) => {
      if (result.isConfirmed) {
        signOut(auth).then(() => {
          Swal.fire('Logged Out', 'You have been logged out.', 'success');
          navigate('/');
        });
      }
    });
  };

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row bg-cyan-100">
      <aside className="md:w-64 w-full bg-white shadow-md p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold text-cyan-600 mb-2">Accounts</h2>
          <p className="text-sm text-gray-500 mb-4">
            Logged in as: <span className="font-bold text-cyan-700">{currentUser?.displayName}</span>
          </p>
          <ul className="space-y-2 overflow-y-auto max-h-[calc(100vh-220px)]">
            {users.map((user) => (
              <li
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`p-3 rounded-xl cursor-pointer transition duration-300 ${
                  selectedUser?.id === user.id
                    ? 'bg-cyan-300 text-white'
                    : 'hover:bg-cyan-100 text-gray-700'
                }`}
              >
                <div className="font-semibold">{user.name}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={handleLogout}
          className="mt-4 bg-cyan-500 text-white py-2 px-4 rounded-lg hover:bg-cyan-600 transition"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-6 flex flex-col">
        {selectedUser ? (
          <>
            <div className="border-b pb-4 mb-4">
              <h2 className="text-2xl font-bold text-cyan-600">
                Chat with {selectedUser.name}
              </h2>
              <p className="text-sm text-gray-500">{selectedUser.email}</p>
            </div>
            <div className="flex-1 bg-white rounded-xl shadow-inner p-4 overflow-y-auto space-y-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-xs px-4 py-2 rounded-lg break-words ${
                    msg.senderId === currentUser.uid
                      ? 'bg-cyan-500 text-white self-end ml-auto'
                      : 'bg-gray-200 text-gray-800 self-start mr-auto'
                  }`}
                >
                  {msg.text}
                  <div className="text-xs text-right mt-1 opacity-60">
                    {msg.timestamp?.toDate().toLocaleTimeString()}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} className="mt-4 flex">
              <input
                type="text"
                className="flex-1 rounded-l-lg px-4 py-2 border border-gray-300 focus:outline-none"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                type="submit"
                className="bg-cyan-500 text-white px-4 py-2 rounded-r-lg hover:bg-cyan-600"
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-400">
            <p className="text-lg">
              Select a user from the sidebar to start chatting
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Chat;
