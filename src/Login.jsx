import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import Swal from 'sweetalert2';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // ✅ Corrected casing here

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Logged in:', userCredential.user);

      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: `Welcome back, ${userCredential.user.displayName || 'User'}!`,
        confirmButtonColor: '#3B82F6', // Tailwind's blue-500
      });

      // Navigate to chat or home page
      navigate('/chat'); // You can change this to your desired route
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message,
        confirmButtonColor: '#EF4444',
      });
    }
  };

  return (
  <div className="w-screen h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] flex items-center justify-center relative overflow-hidden">
    {/* Mesh Background Blobs */}
    <div className="absolute inset-0 z-0 pointer-events-none">
      <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-blue-600 opacity-20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-cyan-500 opacity-20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-200" />
      <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-indigo-500 opacity-20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-500" />
    </div>

    {/* Glassmorphism Login Card */}
    <div className="z-10 bg-white/10 backdrop-blur-xl border border-white/10 text-white p-10 rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-fade-in">
      <h2 className="text-4xl font-bold text-center mb-6 drop-shadow">Login</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 text-white placeholder-gray-400 border border-gray-600 bg-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 hover:-translate-y-1 transition duration-300 hover:shadow-lg backdrop-blur-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 text-white placeholder-gray-400 border border-gray-600 bg-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 hover:-translate-y-1 transition duration-300 hover:shadow-lg backdrop-blur-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-full font-semibold hover:brightness-110 hover:-translate-y-1 transition-all duration-500 hover:shadow-2xl"
        >
          Login
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-300">
        Don’t have an account?{' '}
        <span
          onClick={() => navigate('/signup')}
          className="text-blue-400 cursor-pointer hover:underline"
        >
          Sign up
        </span>
      </p>
    </div>
  </div>
);

}

export default Login;
