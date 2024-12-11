import React from 'react'

interface CardDataProps {
  data: {
    name: string;
    size: string;
    link: string;
    date: string;
  };
  [key: string]: unknown;
}
const ListCard = ({ data }: CardDataProps) => {
  return (
    <div className="w-full list-card cursor-pointer flex flex-col gap-1 justify-center items-center rounded-[8px] p-3">
      <span className='text-lg font-medium capitalize w-full'>
        {data.name}
      </span>
      <div className='flex w-full justify-between items-center'>
      <div className='flex justify-start items-center gap-3'>
        <span className=' text-sm font-normal text-zinc-700'>Sent {data.date}</span>
        <span className=' text-xs font-normal text-zinc-700'>|</span>
        <span className=' text-sm font-normal text-zinc-700'>({data.size})</span>
      </div>
      <div>
        <span>
        download
        </span>
      </div>
      </div>
    </div>
  )
}

export default ListCard
