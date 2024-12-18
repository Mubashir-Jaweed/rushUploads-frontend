'use client'
import React, { useEffect, useRef, useState } from 'react'
import { HiDotsVertical } from "react-icons/hi";

interface CardDataProps {
  data: {
    name: string;
    size: string;
    link: string;
    date: string;
  };
  status: string
  [key: string]: unknown;
}

const GridCard = ({ data, status }: CardDataProps) => {

  const [menu, setMenu] = useState(false)

  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  return (
    <div className="relative w-[300px]  list-card cursor-pointer hover:bg-[#f5f5f57e] bg-[#f5f5f52d] flex flex-col gap-1 justify-between items-start rounded-[8px]">

      <span className='text-lg font-medium capitalize  text-stone-800 pt-3 pl-3'>
        {data.name}
      </span>
      <div className='flex w-full justify-between items-end p-[3px]'>

        <div className='flex justify-start items-center gap-2 p-2'>
          <span className=' text-sm font-normal text-zinc-700'>{status} {data.date}</span>
          <span className=' text-xs font-normal text-zinc-700'>|</span>
          <span className=' text-sm font-normal text-zinc-700'>({data.size})</span>
        </div>
        <span onClick={() => setMenu(!menu)} onBlur={() => setMenu(false)} className='delay-5ms hover:bg-[#32323218] text-stone-800 p-2 rounded-full flex justify-center items-center'>
          <HiDotsVertical className='size-5' />
        </span>
      </div>
      {menu && <div ref={menuRef} className='absolute top-14 right-8 z-10  bg-[#ffffff] w-[115px] rounded-[8px] p-1 '>
        <span className=' hover:bg-[#a1a1a14d] p-1 rounded-[8px] w-full flex  justify-start items-center'>
          Download
        </span>
        <span className=' hover:bg-[#a1a1a14d] p-1 rounded-[8px] w-full flex  justify-start items-center'>
          Delete
        </span>
        <span className=' hover:bg-[#a1a1a14d] p-1 rounded-[8px] w-full flex  justify-start items-center'>
          Create link
        </span>
      </div>}

    </div>
  )
}

export default GridCard
