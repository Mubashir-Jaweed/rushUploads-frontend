'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import { MdEmail } from "react-icons/md";
import { IoLockClosed } from "react-icons/io5";
import { IoLockOpen } from "react-icons/io5";
import { LuEyeClosed } from "react-icons/lu";
import { GoEye } from "react-icons/go"; import PulsatingButton from '@/components/ui/pulsating-button';

const page = () => {
  const [isHidden, setIsHidden] = useState(true);

  return (
    <div className='auth-bg w-full h-screen flex  justify-center items-center'>
      <div className='flex flex-col justify-center items-center gap-5'>
        <Link href={'/'} className='font-bold text-2xl '>Rush Uploads</Link>
        <span className='text-center  text-zinc-700 text-lg'>
          Your are only a few minutes away
        </span>
        <div className='rounded-xl glass-bg flex justify-between items-center w-80'>
          <MdEmail className='text-2xl ml-3 text-stone-600' />
          <input type='email' placeholder='Email' className='bg-transparent  text-stone-800 text-xl font-normal p-4 outline-none h-full w-[88%]' />
        </div>
        <div className='rounded-xl glass-bg flex justify-between items-center w-80'>
          {isHidden ? <IoLockClosed className='text-2xl ml-3 text-stone-600' />
            : <IoLockOpen className='text-2xl ml-3 text-stone-600' />}

          <input type={isHidden ? 'password' : 'text'} placeholder='Password' className='bg-transparent text-stone-800 text-xl font-normal p-4 outline-none h-full w-[88%]' />
          {isHidden ? <LuEyeClosed onClick={() => setIsHidden(!isHidden)} className='cursor-pointer text-2xl mr-3 text-stone-600' />
            : <GoEye onClick={() => setIsHidden(!isHidden)} className='cursor-pointer text-2xl mr-3 text-stone-600' />}

        </div>
        <div className='mb-2 w-80 flex justify-end'>
          <Link href={'/'} className='text-md text-[#1d7fff] underline italic'>Forgot Password?</Link>
        </div>
        <PulsatingButton className="text-lg font-medium px-14 py-3 rounded-full flex justify-center items-center">Continue with Email
        </PulsatingButton>

        <span className='h-line'>
        </span>
        <button className='w-72 rounded-full p-3 bg-white text-lg font-medium'>

          Continue with Google
        </button>
        <span className='text-center  text-zinc-700 text-lg'>
          Dont have an account? <Link href={'/signup'} className='text-[#1d7fff] underline'>Sign-up</Link>

        </span>

      </div>

    </div>
  )
}

export default page
