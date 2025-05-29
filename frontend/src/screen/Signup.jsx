import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../context/Fetching';

function Signup() {
  const [userName , setUserName] = useState('');
  const [email , setEmail] = useState('');
  const [password , setPassword] = useState('');
  const [error , setError] = useState({});
  const [message , setMessage] = useState(null);
  const [loading , setLoading] = useState(false);

  const navigate = useNavigate();

  const {handleSignup} = useFetch();

  const handleSubmit = async(e) => {
    e.preventDefault();
    const newError = {};
    if(userName.trim() === ''){
      newError.userName = 'Username is required*'
    }
    if(email.trim() === ''){
      newError.email = 'Email is required*'
    }
    if(password.trim() === ''){
      newError.password = 'Password is required*'
    }
    else if(password.length < 8 ){
      newError.password = 'Create strong password*'
    }

    setError(newError);
    if(Object.keys(newError).length === 0 ){
      setLoading(true);
      const response = await handleSignup({email , userName , password});
      if( response === "success" ){
        navigate('/login');
      }
      else{
        setMessage(response);
      }
      setLoading(false);
    }
  }
  return (
    <div className=' min-h-screen flex justify-center items-center bg-green-100 '>
      <form onSubmit={handleSubmit} className=' w-full md:w-1/2 px-10 flex flex-col items-center gap-8 text-green-800 bg-gradient-to-r from-green-300 to-green-400 border-2 rounded-none md:rounded-xl border-slate-200 py-5'>
        <h1 className=' text-5xl font-bold '>Sign Up</h1>
        <label className=' flex flex-col gap-1'>
          <div>
          <span className=' text-lg font-medium'>Username</span>
          <span className=' mr-2 text-red-500'>*</span>
          </div>
          <input
            type="text"
            className=' outline-none bg-green-200 rounded-md pl-1 md:w-xs'
            placeholder='Username'
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            
          />
          {error.userName && <p className=' text-sm text-red-500 font-medium'>{error.userName}</p>}
        </label>
        <label className=' flex flex-col gap-1'>
          <div>
          <span className=' text-lg font-medium'>Email</span>
          <span className=' mr-2 text-red-500'>*</span>
          </div>
          <input
            type="email"
            className=' outline-none bg-green-200 rounded-md pl-1 md:w-xs'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            
          />
          {error.email && <p className=' text-sm text-red-500 font-medium'>{error.email}</p>}
        </label>
        <label className=' flex flex-col gap-1'>
          <div>
          <span className=' text-lg font-medium'>Create Password</span>
          <span className=' mr-2 text-red-500'>*</span>
          </div>
          <input
            type="password"
            className=' outline-none bg-green-200 rounded-md pl-1 md:w-xs'
            placeholder='Create Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            
          />
          {error.password && <p className=' text-sm text-red-500 font-medium'>{error.password}</p>}
        </label>
        <div>
          <span className=' text-lg font-medium'>Already a user?</span>
          <span className=' text-lg pl-1 cursor-pointer text-blue-500' onClick={() => {navigate('/login')}}>click here</span>
        </div>
        {message && <p className=' font-medium text-red-500'>{message}</p>}
        <button type="submit" className=" bg-blue-600 text-white text-lg font-medium px-2 py-1 rounded-md hover:bg-blue-700 cursor-pointer">{loading ? "Signup..." : "SignUp"}</button>
      </form>
    </div>
  )
}

export default Signup
