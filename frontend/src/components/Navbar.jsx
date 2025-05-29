import React, { useState } from 'react'
import { FaFacebookMessenger, FaSignInAlt, FaSignOutAlt, FaUser, FaEllipsisV } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useFetch } from '../context/Fetching';

function Navbar() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [isMenu, setIsMenu] = useState(false);
  const {handleLogout} = useFetch();

  const Logout = () => {
    handleLogout();
    navigate('/login');
  }

  return (
    <div className='fixed w-full z-10 top-0 flex h-18 px-16 justify-between items-center bg-[#1b5e20]'>
      <div className='flex justify-center items-center gap-1'>
        <FaFacebookMessenger size={40} className='text-green-600' />
        <Link to="/"><h1 className='text-2xl font-bold text-green-500'>Chat App</h1></Link>
      </div>

      {/* Desktop Links */}
      <div className='hidden md:flex gap-12 text-xl font-semibold text-green-500'>
        {!token ? (
          <div className='flex gap-1 items-center'>
            <FaSignInAlt size={24} />
            <Link to='/login'><span className='hover:underline cursor-pointer'>Login</span></Link>
          </div>
        ) : (
          <div className='flex gap-1 items-center'>
            <FaSignOutAlt size={24} />
            <span onClick={Logout} className='hover:underline cursor-pointer'>Logout</span>
          </div>
        )}
        <div className='flex gap-1 items-center'>
          <FaUser size={20} />
          <Link to='/profile'><span className='hover:underline cursor-pointer'>Profile</span></Link>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className='md:hidden relative text-green-500'>
        <FaEllipsisV size={20} className='cursor-pointer' onClick={() => setIsMenu(!isMenu)} />
        {isMenu && (
          <div className='absolute right-0 bg-white shadow-md rounded-lg p-4 flex flex-col gap-3'>
            {!token ? (
              <Link to='/login' onClick={() => setIsMenu(false)} className='flex items-center gap-2'>
                <FaSignInAlt size={20} /> Login
              </Link>
            ) : (
              <span onClick={handleLogout} className='flex items-center gap-2 cursor-pointer'>
                <FaSignOutAlt size={20} /> Logout
              </span>
            )}
            <Link to='/profile' onClick={() => setIsMenu(false)} className='flex items-center gap-2'>
              <FaUser size={20} /> Profile
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar;
