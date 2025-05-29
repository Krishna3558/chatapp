import React from 'react'
import { FaUser , FaEnvelope } from 'react-icons/fa';

function Userprofile({ user, onClose }) {
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
          <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-red-500">✖</button>
          <div className="flex flex-col items-center">
            {user.img ? <img
                    src={user?.img}
                    alt='User image'
                    className='w-20 h-20 rounded-full'
            /> : <button className=' rounded-full w-28 h-28 flex justify-center items-center bg-gray-500 text-white'>
                    <FaUser className="text-6xl" />
                </button>}
            <div className=" flex gap-2 mt-2 ">
                        <span className=' font-bold text-2xl '>{user.userName}</span>
            </div>
            <div className=" flex gap-2 mt-3 text-lg">
                        <div className=' flex gap-1 items-center font-medium'>
                            <h4>Bio:</h4>
                        </div>
                        <span>{user.bio}</span>
            </div>
            <div className=" flex gap-2 mt-2 text-lg">
                        <div className=' flex gap-1 items-center font-medium'>
                            <h4>Email:</h4>
                        </div>
                        <span>{user.email}</span>
            </div>
            <p className="flex gap-1 items-center text-lg mt-2">
              <span className=' font-medium text-lg'>Status: </span>
              {user.isOnline ? (
                <span className="text-green-500">Online</span>
              ) : (
                <span className="text-gray-500">Offline</span>
              )}
            </p>
            <p className="flex gap-1 items-center text-lg mt-2">
              <span className=' font-medium text-lg'>Member since: </span>
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
            <p className="flex gap-1 items-center text-lg mt-2">
              <span className=' font-medium text-lg'>Member since: </span>
              <span className=' text-green-500'>Active</span>
            </p>
          </div>
        </div>
      </div>
    );
}  

export default Userprofile