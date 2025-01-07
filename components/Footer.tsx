import React from 'react'
import Image from "next/image";
import logo from '../assets/logo3.png'
import Link from 'next/link';
import { HiOutlineMail } from "react-icons/hi";

const Footer = () => {
  return (
    <div className=' py-20  flex flex-col justify-center items-center'>
      <div className='w-[80%] border-y py-20 border-zinc-300 flex justify-between items-start flex-wrap'>
        <div>
        <Image alt="logo" src={logo} className="h-[50px] w-[150px]"/>
        <div className='w-[300px] text-stone-800'>From sharing large files with friends to delivering professional client work</div>

        </div>
       <div className='flex justify-center items-start gap-16'>
       <div className='flex flex-col justify-center items-start gap-2'>
            <span className='text-2xl font-semibold text-stone-800 pb-3'>Company</span>
            <Link href={'/'} className='text-xl hover:text-[#ff4262eb] text-stone-700'>Home</Link>
            <Link href={'/upload'} className='text-xl hover:text-[#ff4262eb] text-stone-700'>Upload</Link>
            <Link href={'/support'} className='text-xl hover:text-[#ff4262eb] text-stone-700'>Support</Link>
            
        </div>
        <div className='flex flex-col justify-center items-start gap-2'>
            <span className='text-2xl font-semibold text-stone-800 pb-3'>Benefits</span>
            <Link href={'/affiliate'} className='text-xl hover:text-[#ff4262eb] text-stone-700'>Affiliate</Link>
            <Link href={'/pricing'} className='text-xl hover:text-[#ff4262eb] text-stone-700'>Pricing</Link>
            
        </div>
       </div>
       <div className='flex flex-col justify-center items-start gap-2'>
            <span className='text-2xl font-semibold text-stone-800 pb-3'>Contact</span>
            <Link href={'/affiliate'} className='text-xl hover:text-[#ff4262eb] text-stone-700 flex justify-center items-center gap-3'><HiOutlineMail className='size-6 text-[#ff4262eb]'/> support@rushuploads.com</Link>
            <Link href={'/pricing'} className='text-xl hover:text-[#ff4262eb] text-stone-700 flex justify-center items-center gap-3'><HiOutlineMail className='size-6 text-[#ff4262eb]'/> admin@rushuploads.com</Link>
            
        </div>
      </div>
      <div className='w-[90%] flex justify-center items-center'>
        <div className='pt-[50px] text-zinc-600 text-base'>©2025 Rush-Uploads, easy, free. File sharing storage made simple!. All rights reserved.</div>
      </div>
    </div>
  )
}

export default Footer
