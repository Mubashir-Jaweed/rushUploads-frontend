import React from 'react'

const Sidebar = () => {
  return (
    <div className='border border-black w-[15%] h-[80vh] pl-10 p-5'>
      <span className='text-xl font-semibold'>
        Dashboard
        </span>
        <div className='flex justify-center items-start flex-col py-8 gap-2'>
            <span>Workspace</span>
            <span>Profile & Security</span>
            <span>Payment & Plans</span>
        </div>
    </div>
  )
}

export default Sidebar
