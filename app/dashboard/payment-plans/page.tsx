import Navbar from '@/components/Navbar'
import { div } from 'framer-motion/client'
import React from 'react'
import Sidebar from '../components/Sidebar'
import PaymentPlans from './components/PaymentPlans'

const page = () => {
    return (
        <>
            <Navbar />
            <div className=" w-full h-screen auth-bg flex items-end">
                <div className=' w-full  h-[87vh] flex  justify-center pt-11  gap-10 overflow-style'>
                    <PaymentPlans />
                    <Sidebar />
                </div>
            </div>
        </>
    )
}

export default page
