'use client'
import React, { useState } from 'react'
import { FadeText } from './ui/fade-text'
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import Link from 'next/link';


const Faq = () => {
        const [tab, setTab ] = useState(0);
    
    return (
        <div className='w-full flex  justify-center items-center py-24'>
            <div className="w-[80%]  flex flex-col justify-center items-center gap-3" >

               <span className='text-center'>
               <FadeText
                    direction="up"
                    framerProps={{
                        show: { transition: { delay: 0.5 } },
                    }}
                    className="max-md:text-4xl max-sm:text-2xl max-sm:leading-[30px] max-sm:font-bold max-md:w-[70%] md:w-[80%] max-sm:w-[80%] text-6xl font-semibold text-center text-stone-800 leading-[65px]"
                >
                    Frequently asked questions</FadeText>
               </span>
                    <div className='max-sm:w-[90%] max-md:w-[75%] max-sm:mt-4 mt-10 w-[60%] flex flex-col justify-center items-center gap-3'>
                        {data.map((val,i)=>(
                            <div key={i} onClick={()=>setTab(i)} className={`${tab == i ? 'h-[120px] max-sm:h-[140px]' : 'h-[60px]'} delay-5ms cursor-pointer acc-cont border border-zinc-300 rounded-[5px] flex flex-col justify-center items-start  w-full p-4`}>
                               <div className='flex justify-between items-center w-full'>
                               <span className='max-md:text-lg max-sm:text-base acc-head text-xl font-normal text-stone-800 '>
                                {val.q}
                                </span>
                                {tab == i ? <IoIosArrowUp className='size-5'/>:
                                <IoIosArrowDown className='size-5'/>}
                               </div>
                                {tab ==i && <span className={`delay-5ms text-[15px] max-md:text-[13px] max-sm:text-[10px] text-zinc-500 ${tab == i ?' mt-3': ' opacity-0'}`}>
                                {val.a}
                                </span>}
                            </div>
                        ))}

                        <div className='text-sm text-center text-zinc-500'>Still have questions? Email us at <Link href={'mailto:[emailhere]'} className='underline text-[#ff4262]'>support@rushuploads.ai</Link></div>
                    </div>
            </div>

        </div>
    )
}

const data = [
    {
        q: 'What is Rush uploads?',
        a: 'Rush uploads is a secure and efficient file-sharing platform that allows you to share files quickly and seamlessly across devices. It’s designed to streamline collaboration and simplify the file transfer process.'
    },
    {
        q: 'How can I get started with Rush uploads?',
        a: 'Getting started is easy! Simply sign up for an account, upload your files, and share the generated link with your intended recipients. No additional installations or technical expertise are required.'
    },
    {
        q: 'Is Rush uploads secure?',
        a: 'Yes, Rush uploads prioritizes the security of your data. We use advanced encryption protocols to ensure that your files remain safe and accessible only to authorized users.'
    },
    {
        q: 'Can I share large files with Rush uploads?',
        a: 'Absolutely! Rush uploads supports large file sharing, enabling users to transfer files of significant sizes without any hassle.'
    },
];

export default Faq
