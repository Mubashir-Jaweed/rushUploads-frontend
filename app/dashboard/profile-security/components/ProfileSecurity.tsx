'use client'
import PulsatingButton from '@/components/ui/pulsating-button'
import { useUserContext } from '@/contexts/user'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const ProfileSecurity = () => {

  const API_URL = 'https://rushuploads-backend.onrender.com/'
  const token = localStorage.getItem('token')
  const router = useRouter();
  const [fName, setFName] = useState('')
  const [fieldUpdated, setFieldUpdated] = useState(false)

    const { user } = useUserContext();
  

  let profile: string | null  = null

  const getProfile = async () => {
    if(!token){
      return
    }
    setFieldUpdated(false)
    try {
      const response = await axios.get(`${API_URL}profiles`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response) {
        console.log(response)
        setFName(response.data.data.profile.fullName)
        profile = response.data.data.profile
      }
    }
    catch (error) {
      console.error('Error getting files:', error);
      
    }
  }

  const updateProfile = async () => {
    if (fName.length < 3) return toast.error('Full name is at least 2 character long')
    try {
      const data = {
        fullName: fName,

      }

      let response
      response = await axios.post(`${API_URL}profiles`, 
        data
      , {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response) {
        console.log(response)
        toast('Successfull Update Name')
        setFName(response.data.data.profile.fullName)
        getProfile()
      }
    }
    catch (error) {
      console.error('Error getting files:', error);   
           toast.error('error updating name')      
    }
  }

  useEffect(() => {
    if (!token) {
      router.push('/upload')

    }
    getProfile()

  }, [])


  const changeFName = (n: string) => {
    setFName(n)
    setFieldUpdated(true)
  }
  const signout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  const changePass = () =>{
    router.push('/change-password')
  }


  return (
    <div className='max-lg:w-[80%] max-sm:w-[90%] w-[60%] flex flex-col gap-2 justify-start items-start p-5'>
      <span className='text-base font-medium max-sm:text-sm text-zinc-600'>{user?.email}</span>
      <span className='text-stone-800 text-3xl max-sm:text-2xl font-semibold' >Profile & Security</span>
      <div className=' w-full border-t my-5 py-5 border-zinc-400 flex flex-col justify-start items-start gap-2 '>
        <span className='text-stone-800 text-xl  font-semibold mb-2' >Profile</span>
        <div className='rounded-[6px] upload-input flex justify-between items-center w-full'>
          <input type='email' value={fName} onChange={(e) => changeFName(e.target.value)} placeholder='First Name' className='bg-transparent  max-sm:text-sm text-[16px] font-normal p-3 outline-none h-full w-[96%]  placeholder:text-zinc-500  text-stone-800' />
        </div>

        <PulsatingButton className="max-sm:text-base text-lg font-medium py-3 px-5 my-1 rounded-full flex justify-center items-center delay-5ms" disable={!fieldUpdated} onClick={updateProfile}>Save Changes
        </PulsatingButton>
      </div>
      <div className=' w-full border-t my-5 py-5 border-zinc-400 flex flex-col justify-start items-start gap-2 '>
        <span className='text-stone-800 text-xl font-semibold mb-2' >Change password</span>
        <span className='text-base font-medium text-zinc-600 max-sm:text-sm'>No worries — we've got you covered! Click the button below, so you can update your password in no time.

        </span>
        <PulsatingButton onClick={changePass} className="max-sm:text-base text-lg font-medium py-3 px-5 my-1 rounded-full flex justify-center items-center">Change password
        </PulsatingButton>
      </div>
      <div className=' w-full border-t my-5 py-5 border-zinc-400 flex flex-col justify-start items-start gap-2 '>
        <span className='text-stone-800 text-xl font-semibold mb-2' >Danger zone</span>
        <span className='text-base font-medium text-zinc-600 max-sm:text-sm'>Are you sure you want to sign out? You can always log back in anytime!</span>
        <PulsatingButton className="max-sm:text-base text-lg font-medium py-3 px-5 my-1 rounded-full flex justify-center items-center" onClick={signout} deleteBtn={true} >Sign out
        </PulsatingButton>
      </div>

    </div>
  )
}

export default ProfileSecurity;
