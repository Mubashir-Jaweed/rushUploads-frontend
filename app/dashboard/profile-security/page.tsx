import Navbar from '@/components/Navbar'
import { div } from 'framer-motion/client'
import React from 'react'
import Sidebar from '../components/Sidebar'
import ProfileSecurity from './components/ProfileSecurity'

const page = () => {
    return (
        <div>
            <Navbar />
            <div className=" h-screen w-full auth-bg flex items-end">
                <div className='w-full flex  justify-center items-end gap-10  pt-20 overflow-style'>
                    <ProfileSecurity />
                    <Sidebar />
                </div>
            </div>
        </div>
    )
}

export default page
