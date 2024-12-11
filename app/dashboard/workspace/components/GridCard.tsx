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

const GridCard = ({data} : CardDataProps) => {
  return (
    <div className="w-56 h-44 list-card cursor-pointer flex flex-col gap-1 justify-center items-center rounded-[8px] p-3">
    <span className='text-lg font-medium capitalize w-full text-stone-800'>
      {data.name}
    </span>
   
  </div>
  )
}

export default GridCard
