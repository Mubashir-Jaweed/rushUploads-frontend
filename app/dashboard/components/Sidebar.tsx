import React from 'react'

const Sidebar = () => {
  return (
    <div className='w-[15%] h-[80vh] pl-10 p-5'>
      <span className='text-xl font-semibold text-stone-800'>
        Dashboard
        </span>
        <div className='flex justify-center items-start flex-col py-8 gap-1 text-stone-800'>
            <span className='text-lg border-b border-zinc-400 py-3 px-1 w-full cursor-pointer'>Workspace</span>
            <span className='text-lg border-b border-zinc-400 py-3 px-1 w-full cursor-pointer'>Profile & Security</span>
            <span className='text-lg border-b border-zinc-400 py-3 px-1 w-full cursor-pointer'>Payment & Plans</span>
        </div>
    </div>
  )
}

export default Sidebar
