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
        text:'There is a lot of exciting stuff going on in the stars above us that make astronomy so much fun. The truth is the universe is a constantly changing, moving, some would say “living” thing because you just never know what you are going to see on any given night of stargazing.',
        user:'John Doe'
    },
    {
        text:'There is a lot of exciting stuff going on in the stars above us that make astronomy so much fun. The truth is the universe is a constantly changing, moving, some would say “living” thing because you just never know what you are going to see on any given night of stargazing.',
        user:'Rose Daniel'
    },
    {
        text:'There is a lot of exciting stuff going on in the stars above us that make astronomy so much fun. The truth is the universe is a constantly changing, moving, some would say “living” thing because you just never know what you are going to see on any given night of stargazing.',
        user:'Joshua Shakeel'
    },
    {
        text:'There is a lot of exciting stuff going on in the stars above us that make astronomy so much fun. The truth is the universe is a constantly changing, moving, some would say “living” thing because you just never know what you are going to see on any given night of stargazing.',
        user:'Jack Sparrow'
    },
]
export default Testimonials
