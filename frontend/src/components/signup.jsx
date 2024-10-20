import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';


function Signup() {
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setconfirmPassword] = useState('');

  // After Signup it will automatically redirect to Login page
  const navigateTo = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        'http://localhost:4002/user/signup',
        {
          username,
          email,
          password,
          confirmpassword
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      toast.success(data.message || "User registered successfully");
      navigateTo("/login");
      //Set token into localstorage
      localStorage.setItem("jwt", data.user.token);
      setUserName("");
      setEmail("");
      setPassword("");
      setconfirmPassword("");
    } catch (err) {
      toast.error(err.response.data.errors || "User registration failed!!");
    }
  };

  return (
    <div>
      <div className='flex h-screen items-center justify-center border-r-gray-100'>
        <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-lg'>
          <h2 className='text-3xl font-semibold text-center mb-5 text-blue-800'>Signup</h2>
          <form onSubmit={handleRegister}>
            {/* Username */}
            <div className='mb-4'>
              <label className='block mb-2 font-semibold'>Username</label>
              <input
                className='w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500'
                type='text'
                placeholder='Enter your username'
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

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

            {/* Confirm Password */}
            <div className='mb-4'>
              <label className='block mb-2 font-semibold'>Confirm password</label>
              <input
                className='w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500'
                type='password'
                placeholder='Enter confirm password'
                value={confirmpassword}
                onChange={(e) => setconfirmPassword(e.target.value)}
              />
            </div>

            <button
              type='submit'
              className='w-full p-3 bg-blue-600 text-white hover:bg-blue-900 duration-300 rounded-xl font-semibold'
            >
              Signup
            </button>
            <p className='mt-4 text-center text-gray-600'>
              Already have an account?{' '}
              <Link to='/login' className='text-blue-600 hover:underline'>
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
