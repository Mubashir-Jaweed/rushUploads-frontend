import Navbar from '@/components/Navbar'
import { div } from 'framer-motion/client'
import React from 'react'
import Workspace from './components/Workspace'
import Sidebar from '../components/Sidebar'

const page = () => {
    return (
        <div>
            <Navbar />
            <div className=" h-screen w-full auth-bg flex items-end">
                <div className=' flex  justify-center items-end gap-10 border border-red-500 pt-20 overflow-style'>
                    <Workspace />
                    <Sidebar />
                </div>
            </div>
        </div>
    )
}

export default page
