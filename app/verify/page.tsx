'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { MdEmail } from "react-icons/md";
import { IoLockClosed } from "react-icons/io5";
import { IoLockOpen } from "react-icons/io5";
import { LuEyeClosed } from "react-icons/lu";
import { GoEye } from "react-icons/go"; import PulsatingButton from '@/components/ui/pulsating-button';
import {  useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

const page = () => {
  const [isHidden, setIsHidden] = useState(true);
  const [otp, setOtp] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const token = localStorage.getItem('token')
  const verifyToken = localStorage.getItem('ru_anonymous_id')
  const router = useRouter();
  const searchParams = useSearchParams();
  const API_URL = 'https://rushuploads-backend.onrender.com/'


  useEffect(() => {
    if (token) {
      router.push('/dashboard/workspace')
    }
  }, [])


  const handleOtp = async () => {
    setIsProcessing(true)

    try {
      const data = {
        otp: otp,
        type:'VERIFY_EMAIL'
      };
      const response = await axios.post(`${API_URL}auth/verify-otp`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${verifyToken}`,
        },


      });

      if (response) {
        console.log(response)
        localStorage.setItem('token', response.data.data.token)
        localStorage.removeItem('ru_anonymous_id')
        router.push('/dashboard/workspace')
        setIsProcessing(false)

      }
    } catch (error) {
      console.error('Error SignUp:', error.response.data.info.message);
      setIsProcessing(false)

      throw error;
    }

  }

  return (
    <div className='auth-bg w-full h-screen flex  justify-center items-center'>
      <div className='flex flex-col justify-center items-center gap-5'>
        <Link href={'/'} className='font-bold text-2xl '>Rush Uploads</Link>
        <span className='text-center  text-zinc-700 text-lg'>
          An email with the code has been sent to <br /> {searchParams.get('e')}
        </span>

        <div className='rounded-xl glass-bg flex justify-between items-center w-80'>
          {isHidden ? <IoLockClosed className='text-2xl ml-3 text-stone-600' />
            : <IoLockOpen className='text-2xl ml-3 text-stone-600' />}

          <input type={isHidden ? 'password' : 'text'} value={otp} onChange={(e) => setOtp(e.target.value)} placeholder='Verification code' className='bg-transparent text-stone-800 text-xl font-normal p-4 outline-none h-full w-[88%]' />
          {isHidden ? <LuEyeClosed onClick={() => setIsHidden(!isHidden)} className='cursor-pointer text-2xl mr-3 text-stone-600' />
            : <GoEye onClick={() => setIsHidden(!isHidden)} className='cursor-pointer text-2xl mr-3 text-stone-600' />}

        </div>
        <div className='mb-2 w-80 flex justify-center'>
          <Link href={'/'} className='text-md text-zinc-400 underline'>Did not get the code?</Link>
        </div>
        <PulsatingButton onClick={handleOtp} className={`text-lg font-medium px-14 py-3 rounded-full flex justify-center items-center ${isProcessing ? 'cursor-wait' : 'cursor-pointer'}`}>Submit
        </PulsatingButton>
        <span className='text-center  text-zinc-700 text-lg'>
          Dont have an account? <Link href={'/signup'} className='text-[#1d7fff] underline'>Sign-up</Link>

        </span>

      </div>

    </div>
  )
}

export default page
