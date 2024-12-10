import GridPattern from '@/components/ui/grid-pattern'
import { cn } from '@/lib/utils'
import React from 'react'
import { MdEmail } from 'react-icons/md'

const UploadHero = () => {
    return (
        <div className="bg-white h-screen w-full p-3" >
            <GridPattern
                width={40}
                height={40}
                x={-1}
                y={-1}
                className={cn(
                    "[mask-image:linear-gradient(to_bottom_top,white,transparent,transparent)] ",
                )}
            />
            <div className="h-[100%] w-[100%] hero-bg rounded-xl flex  justify-center items-center">


                <div className="glass-bg p-5 flex gap-1  w-[700px] flex-col items-center justify-start overflow-hidden rounded-2xl shadow-2xl "
                >
                    <div className='w-full'>
                        <span className='text-2xl font-semibold text-stone-800'>Upload Files</span>
                    </div>
                    <div className='flex justify-center items-center  border-[3px] border-zinc-400 border-dashed w-full h-[240px] rounded-xl mt-1'>
                        upload
                    </div>
                    <div className='flex justify-between items-center w-full text-[12px] text-zinc-600 '>
                        <span>Supported formts: JPEG, XLS, PDF, PNG</span>
                        <span>Max size: 250GB</span>
                    </div>
                    <div className='w-full flex justify-start items-center gap-3 my-3'>
                        <label className='flex gap-1 justify-center items-center text-stone-800 text-[15px] font-medium'>
                            <input type='radio' className='size-4' />
                            Send Email
                        </label>
                        <label className='flex gap-1 justify-center items-center text-stone-800 text-[15px] font-medium'>
                            <input type='radio' className='size-4' />
                            Create Link
                        </label>
                    </div>
                   <div className='w-full bg-transparent flex flex-col gap-2'>
                        <input type='email' placeholder='Your Email' className=' placeholder:text-zinc-500 upload-input text-stone-800 text-lg font-normal outline-none p-3  w-full rounded-xl' />
                        <input type='email' placeholder='Email to' className=' placeholder:text-zinc-500 upload-input text-stone-800 text-lg font-normal outline-none p-3  w-full rounded-xl' />
                        <input type='text' placeholder='Subject' className=' placeholder:text-zinc-500 upload-input text-stone-800 text-lg font-normal outline-none p-3  w-full rounded-xl' />
                        <textarea placeholder='Message' className=' placeholder:text-zinc-500 upload-input text-stone-800 text-lg font-normal outline-none p-3  w-full rounded-xl'>

                        </textarea>
                   </div>
                </div>


            </div>
        </div>
    )
}

export default UploadHero
