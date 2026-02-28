import React from 'react';
import ProfileInfoCard from '../Cards/ProfileInfoCard';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className='h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto h-full flex items-center justify-between px-4 md:px-0'>
         <Link to="/dashboard">
            <h2 className='text-lg md:text-xl font-semibold text-black'>
               Interview Prep AI
            </h2>
         </Link>

         <ProfileInfoCard />
      </div>
    </div>
  )
}

export default Navbar