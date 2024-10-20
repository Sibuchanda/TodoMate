import React, { useState } from 'react';
import { Link } from 'react-router-dom';  // Removed useNavigate
import axios from 'axios';
import toast from 'react-hot-toast';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        'http://localhost:4002/user/login',
        { email, password },
        { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
      );

      console.log('Login Response:', data);

      // Check if the token exists in the response
      if (data.user && data.user.token) {
        localStorage.setItem("jwt", data.user.token);  // Save token
        toast.success(data.message || "User Login successfully");

        // Force a page reload to ensure the token is available globally
        window.location.href = "/";  // This reloads the app and resolves the first-time issue
      } else {
        throw new Error("Token not found in response");
      }

      setEmail("");
      setPassword("");
    } catch (err) {
      console.log('Login Error:', err);
      toast.error(err.response?.data?.errors || "User Login failed!!");
    }
  };

  return (
    <div>
      <div className='flex h-screen items-center justify-center border-r-gray-100'>
        <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-lg'>
          <h2 className='text-2xl font-semibold text-center mb-5 text-blue-800'>Login</h2>
          <form onSubmit={handleRegister}>
            {/* Email */}
            <div className='mb-4'>
              <label className='block mb-2 font-semibold'>Email</label>
              <input
                className='w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500'
                type='text'
                placeholder='Enter your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className='mb-4'>
              <label className='block mb-2 font-semibold'>Password</label>
              <input
                className='w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500'
                type='password'
                placeholder='Enter your password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type='submit'
              className='w-full p-3 bg-blue-600 text-white hover:bg-blue-900 duration-300 rounded-xl font-semibold'
            >
              Login
            </button>
            <p className='mt-4 text-center text-gray-600'>
              New User?{' '}
              <Link to='/signup' className='text-blue-600 hover:underline'>
                Signup
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
