import React from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

const page = () => {
  return (
    <div className='flex'>
        <Sidebar/>
        <div className='w-full h-screen flex flex-col bg-gray-100'>
        <Navbar />
        </div>
      
    </div>
  )
}

export default page
