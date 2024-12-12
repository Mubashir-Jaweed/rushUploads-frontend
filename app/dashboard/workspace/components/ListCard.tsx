import React from 'react'
import { LuDownload } from "react-icons/lu";
import { IoClose } from "react-icons/io5";

interface CardDataProps {
  data: {
    name: string;
    size: string;
    link: string;
    date: string;
  };
  status:string

  [key: string]: unknown;
}
const ListCard = ({ data,status }: CardDataProps) => {
  return (
    <div className="hover:bg-[#f5f5f57e] bg-[#f5f5f52d] w-full list-card cursor-pointer flex flex-col  justify-center items-center rounded-[8px] p-3">
      <span className='text-lg font-medium capitalize w-full text-stone-800'>
        {data.name}
      </span>
      <div className='flex w-full justify-between items-end'>
      <div className='flex justify-start items-center gap-3'>
        <span className=' text-sm font-normal text-zinc-700'>{status} {data.date}</span>
        <span className=' text-xs font-normal text-zinc-700'>|</span>
        <span className=' text-sm font-normal text-zinc-700'>({data.size})</span>
      </div>
      <div className='flex justify-center items-center '>
        <span className='delay-5ms hover:bg-[#32323218] text-stone-800 p-2 rounded-full flex justify-center items-center'>
        <LuDownload className='size-5'/>
        </span>
        <span className='delay-5ms hover:bg-[#32323218] text-stone-800 p-2 rounded-full flex justify-center items-center'>
        <IoClose className='size-5'/>
        </span>
      </div>
      </div>
    </div>
  )
}

export default ListCard
