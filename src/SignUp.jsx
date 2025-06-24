import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import Swal from 'sweetalert2';
import { doc, setDoc } from 'firebase/firestore';

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update display name
      await updateProfile(user, { displayName: name });

      // Add user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: name,
        email: email,
      });

      Swal.fire({
        icon: 'success',
        title: 'Account created!',
        text: 'You have successfully signed up.',
        confirmButtonColor: '#10B981',
      });

      navigate('/login');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Sign up failed',
        text: error.message,
        confirmButtonColor: '#EF4444',
      });
    }
  };
return (
  <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] relative overflow-hidden">
    {/* Optional bluish mesh background for added depth */}
    <div className="absolute inset-0 z-0 pointer-events-none">
      <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-blue-600 opacity-20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-cyan-500 opacity-20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-200" />
      <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-indigo-500 opacity-20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-500" />
    </div>

    {/* Card */}
    <div className="z-10 bg-white/10 backdrop-blur-xl border border-white/10 text-white p-10 rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-fade-in">
      <h2 className="text-3xl font-bold text-center mb-6 drop-shadow">Create Account</h2>

      <form onSubmit={handleSignup} className="space-y-5">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 text-white placeholder-gray-400 border border-gray-600 bg-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 hover:-translate-y-1 transition duration-300 hover:shadow-lg backdrop-blur-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 text-white placeholder-gray-400 border border-gray-600 bg-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 hover:-translate-y-1 transition duration-300 hover:shadow-lg backdrop-blur-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 text-white placeholder-gray-400 border border-gray-600 bg-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 hover:-translate-y-1 transition duration-300 hover:shadow-lg backdrop-blur-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-3 rounded-full font-semibold hover:bg-green-400 transition duration-500 hover:-translate-y-1 shadow-md"
        >
          Sign Up
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-300">
        Already have an account?{' '}
        <span
          onClick={() => navigate('/')}
          className="text-green-400 cursor-pointer hover:underline"
        >
          Login
        </span>
      </p>
    </div>
  </div>
);

}

export default SignUp;
