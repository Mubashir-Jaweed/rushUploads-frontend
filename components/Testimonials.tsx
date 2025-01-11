'use client'
import { MdOutlineFormatQuote } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

import React, { useState } from 'react'
import { FadeText } from './ui/fade-text'
import BlurIn from './ui/blur-in'
import Particles from "./ui/particles";

const Testimonials = () => {


    const [tab, setTab ] = useState(0);

    const next = () =>{
        if(data.length - 1 == tab ){
            setTab(0);
        }else{
            setTab(tab + 1);

        }
    }
    const prev = () =>{
        if(0 == tab ){
            setTab(data.length-1);
        }else{
            setTab(tab - 1);

        }
    }
    return (
        <div className='testimonial  py-24 my-14 flex justify-center items-center '>
            <div className="w-[80%]  flex flex-col justify-center items-center  gap-3" >
           
                <FadeText
                    direction="up"
                    framerProps={{
                        show: { transition: { delay: 0.5 } },
                    }}
                    className="max-md:text-4xl max-sm:text-2xl max-sm:leading-[30px] max-sm:font-bold text-6xl font-semibold text-center text-stone-800 leading-[65px]"
                >
                  What our client says
                </FadeText>

               <div className="flex justify-center items-center flex-col gap-3">
              {data.map((val,i)=> i == tab &&(
                 <BlurIn className='max-md:mt-2 mt-10' key={i} duration={1}>
                 <div className='max-md:w-[100%] max-md:px-9 w-[500px]  flex justify-center items-center flex-col gap-3'>
                     <MdOutlineFormatQuote className="max-md:size-7 size-10 text-[#ff4262]"/>
                     <span className="text-lg font-medium text-zinc-700 max-md:text-base max-sm:text-sm">{val.text}</span>
                     <span className="text-base text-zinc-400 font-semibold max-md:text-sm">"{val.user}"</span>
                 </div>
             </BlurIn>
              ))}
                <div className="z-10 flex justify-center items-center gap-5">
                    <span onClick={()=>prev()} className="p-2 rounded-full bg-zinc-200 hover:bg-[#ff90a337]">
                        <IoIosArrowBack className="size-6 hover:text-[#ff4262]" />
                    </span>
                    <span onClick={()=>next()} className="p-2 rounded-full bg-zinc-200 hover:bg-[#ff90a337]">
                        <IoIosArrowForward className="size-6 hover:text-[#ff4262]" />
                    </span>
                </div>
               </div>


            </div>
        </div>
    )
}


const data = [
    {
        text:'Rush Uploads has completely transformed how I share files! The upload speed is incredible, and the interface is so easy to use. Highly recommended!',
        user:'John Doe'
    },
    {
        text:'Rush Uploads has completely transformed how I share files! The upload speed is incredible, and the interface is so easy to use. Highly recommended!',
        user:'Rose Daniel'
    },
    {
        text:'I’ve tried many platforms, but Rush Uploads is hands down the best. I can upload large files without any hiccups. Great work!',
        user:'Joshua Shakeel'
    },
    {
        text:'Uploading videos and large datasets has never been this easy. Rush Uploads is now an essential part of my workflow. Keep up the good work!',
        user:'Jack Sparrow'
    },
]
export default Testimonials
