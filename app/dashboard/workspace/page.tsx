import Navbar from '@/components/Navbar'
import { div } from 'framer-motion/client'
import React from 'react'
import Workspace from './components/Workspace'
import Sidebar from '../components/Sidebar'

const page = () => {
    return (
        <div>
            <Navbar />
            <div className=" w-full h-screen auth-bg flex items-end">
            <div className=' w-full  h-[87vh] flex  justify-center pt-11  gap-10 overflow-style'>
                    <Workspace />
                    <Sidebar />
                </div>
            </div>
        </div>
    )
}

export default page
