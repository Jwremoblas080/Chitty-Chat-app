import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import SignUp from './SignUp';
import Chat from './Chat';
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
         <Route path="/chat" element={<Chat />} />
    </Routes>
  );
}

export default App;
