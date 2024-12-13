import PulsatingButton from '@/components/ui/pulsating-button'
import React from 'react'

const ProfileSecurity = () => {
  return (
    <div className='  w-[60%] h-[80vh] flex flex-col gap-2 justify-start items-start p-5'>
      <span className='text-base font-medium text-zinc-600'>helloworld@rushuploads.com</span>
      <span className='text-stone-800 text-3xl font-semibold' >Profile & Security</span>
      <div className=' w-full border-t my-5 py-5 border-zinc-400 flex flex-col justify-start items-start gap-2 '>
        <span className='text-stone-800 text-xl font-semibold mb-2' >Profile</span>
        <div className='rounded-[6px] upload-input flex justify-between items-center w-full'>
          <input type='email' placeholder='First Name' className='bg-transparent   text-[16px] font-normal p-3 outline-none h-full w-[96%]  placeholder:text-zinc-500  text-stone-800' />
        </div>
        <div className='rounded-[6px] upload-input flex justify-between items-center w-full'>
          <input type='email' placeholder='Last Name' className='bg-transparent   text-[16px] font-normal p-3 outline-none h-full w-[96%]  placeholder:text-zinc-500  text-stone-800' />
        </div>
        <PulsatingButton className="text-lg font-medium py-3 px-5 my-1 rounded-full flex justify-center items-center delay-5ms" disable={true}>Save Changes
        </PulsatingButton>
      </div>
      <div className=' w-full border-t my-5 py-5 border-zinc-400 flex flex-col justify-start items-start gap-2 '>
        <span className='text-stone-800 text-xl font-semibold mb-2' >Delete your account</span>
        <span className='text-base font-medium text-zinc-600'>No worries — we've got you covered! Click the button below, and we'll send a reset link straight to mubashirmjjawed@gmail.com so you can update your password in no time.

        </span>
        <PulsatingButton className="text-lg font-medium py-3 px-5 my-1 rounded-full flex justify-center items-center">Send Email
        </PulsatingButton>
      </div>
      <div className=' w-full border-t my-5 py-5 border-zinc-400 flex flex-col justify-start items-start gap-2 '>
        <span className='text-stone-800 text-xl font-semibold mb-2' >Change password</span>
        <span className='text-base font-medium text-zinc-600'>This action cannot be undone. All your data, settings, and content will be permanently lost.</span>
        <PulsatingButton className="text-lg font-medium py-3 px-5 my-1 rounded-full flex justify-center items-center" deleteBtn={true} >Delete account
        </PulsatingButton>
      </div>
    </div>
  )
}

export default ProfileSecurity
