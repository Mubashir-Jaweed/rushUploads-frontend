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
    <div className="border rounded p-3 bg-red-600">
      <p className="font-bold">{data.name}</p>
      <p>Size: {data.size}</p>
      <p>Date: {data.date}</p>
      <a href={data.link || '#'} className="text-blue-500 underline">
        Download
      </a>
    </div>
  )
}

export default GridCard
