import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useFetch } from '../context/Fetching';

function Login() {
  const [email , setEmail] = useState('');
  const [password , setPassword] = useState('');
  const [error , setError] = useState({});
  const [message , setMessage] = useState(null);
  const [loading , setLoading] = useState(false);

  const {handleLogin , online} = useFetch();

  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    const newError = {};
    if(email.trim() === ''){
      newError.email = 'Email is required*'
    }
    if(password.trim() === ''){
      newError.password = 'Password is required*'
    }

    setError(newError);
    if(Object.keys(newError).length === 0 ){
      setLoading(true);
      const response = await handleLogin({email , password});
      if( response === "success" ){
        navigate('/');
      }
      else{
        setMessage(response);
      }
      setLoading(false);
    }
  }
  return (
    <div className=' min-h-screen flex justify-center items-center bg-green-100 '>
      <form onSubmit={handleSubmit} className=' w-full md:w-1/2 text-green-800 px-10 flex flex-col items-center gap-8 bg-gradient-to-r from-green-300 to-green-400 border-2 rounded-none md:rounded-xl border-slate-200 py-5'>
        <h1 className=' text-5xl font-bold '>Login</h1>
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
          <span className=' text-lg font-medium'>Password</span>
          <span className=' mr-2 text-red-500'>*</span>
          </div>
          <input
            type="password"
            className=' outline-none bg-green-200 rounded-md pl-1 md:w-xs'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error.password && <p className=' text-sm text-red-500 font-medium'>{error.password}</p>}
        </label>
        <div>
          <span className=' font-medium'>Not an existing user?</span>
          <span className=' pl-1 cursor-pointer text-blue-500' onClick={() => {navigate('/signup')}}>click here</span>
        </div>
        {message && <p className=' font-medium text-red-500'>{message}</p>}
        <button type="submit" className=" bg-blue-600 text-white text-lg font-medium px-2 py-1 rounded-md hover:bg-blue-700 cursor-pointer">{loading ? "Login..." : "Login"}</button>
      </form>
    </div>
  )
}

export default Login
