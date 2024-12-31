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
import { toast } from 'react-toastify';


const page = () => {
  const [isHidden, setIsHidden] = useState(true);
  
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const token = localStorage.getItem('token')
  const router = useRouter();
  const API_URL = 'https://rushuploads-backend.onrender.com/'


  useEffect(() => {
    if (!token) {
      router.push('/dashboard/workspace')
    }
  }, [])


  const chnagePassword = async () => {
    if(password.length < 9 ) return toast.error('Password must be at least 8 character long')
    setIsProcessing(true)

    try {
      const data = {
        password:password
      };
     

      const response = await axios.post(`${API_URL}auth/update-password`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },


      });

      if (response) {
        console.log(response)
        
        setIsProcessing(false)
        router.push('/dashboard/profile-security')
        toast('Password change successfully')

      }
    } catch (error) {
      console.error('Error chnage pass:', error.response.data.info.message);
      setIsProcessing(false)

      
    }

  }

  return (
    <div className='auth-bg w-full h-screen flex  justify-center items-center'>
      <div className='flex flex-col justify-center items-center gap-5'>
        <Link href={'/'} className='font-bold text-2xl '>Rush Uploads</Link>
        <span className='text-center  text-zinc-700 text-lg'>
          Enter your new password         </span>

        <div className='rounded-xl glass-bg flex justify-between items-center w-80'>
          {isHidden ? <IoLockClosed className='text-2xl ml-3 text-stone-600' />
            : <IoLockOpen className='text-2xl ml-3 text-stone-600' />}

          <input type={isHidden ? 'password' : 'text'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='New password' className='bg-transparent text-stone-800 text-xl font-normal p-4 outline-none h-full w-[88%]' />
          {isHidden ? <LuEyeClosed onClick={() => setIsHidden(!isHidden)} className='cursor-pointer text-2xl mr-3 text-stone-600' />
            : <GoEye onClick={() => setIsHidden(!isHidden)} className='cursor-pointer text-2xl mr-3 text-stone-600' />}

        </div>
       
        <PulsatingButton onClick={chnagePassword} className={`text-lg font-medium px-14 py-3 rounded-full flex justify-center items-center ${isProcessing ? 'cursor-wait' : 'cursor-pointer'}`}>Change pssword
        </PulsatingButton>

      </div>

    </div>
  )
}

export default page
