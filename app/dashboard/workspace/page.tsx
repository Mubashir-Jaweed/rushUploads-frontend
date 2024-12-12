import Navbar from '@/components/Navbar'
import { div } from 'framer-motion/client'
import React from 'react'
import Workspace from './components/Workspace'
import Sidebar from '../components/Sidebar'

const page = () => {
    return (
        <div>
            <Navbar />
            <div className="h-screen w-full auth-bg flex  justify-center items-end gap-10">
                <Workspace />
                {/* <Sidebar/> */}
            </div>
        </div>
    )
}

export default page
