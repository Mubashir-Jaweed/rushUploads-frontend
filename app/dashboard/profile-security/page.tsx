import Navbar from '@/components/Navbar'
import { div } from 'framer-motion/client'
import React from 'react'
import Sidebar from '../components/Sidebar'
import ProfileSecurity from './components/ProfileSecurity'

const page = () => {
    return (
        <>
            <Navbar />
            <div className=" w-full h-screen auth-bg flex items-end">
                <div className=' w-full  h-[87vh] flex  justify-center pt-11  gap-10 overflow-style'>
                    <ProfileSecurity />
                    <Sidebar />
                </div>
            </div>
        </>
    )
}

export default page
