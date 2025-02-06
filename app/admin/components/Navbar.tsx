'use client'
import { useUserContext } from '@/contexts/user';
import Link from 'next/link';
import React from 'react'
import { FaUserTie } from "react-icons/fa6";


const Navbar = () => {


        const { isLoading, token, user } = useUserContext();
    
  return (
    <div className='shadow w-full h-[9.5%] flex justify-end items-center px-10'> 
      <Link href={'/dashboard/profile-security'} className='text-stone-800 text-lg  cursor-pointer font-medium flex justify-center items-center gap-2'>
        {user?.email}
        <span className='border-2 rounded-full p-[6px] border-stone-400'>
            <FaUserTie className='size-6 text-stone-800'/>
        </span>
      </Link>
    </div>
  )
}

export default Navbar
