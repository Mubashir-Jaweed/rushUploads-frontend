import BlurIn from '@/components/ui/blur-in'
import PulsatingButton from '@/components/ui/pulsating-button'
import { IoCheckmark } from "react-icons/io5";

import React from 'react'

const PricingHero = () => {
    return (
        <div className='auth-bg py-20 flex justify-center items-center '>
            <div className='w-[90%] pt-20 flex justify-center items-center flex-col gap-5'>
            <BlurIn
					duration={0.9}
					className="max-md:text-4xl max-sm:text-2xl max-sm:leading-[30px] max-sm:font-bold max-md:w-[70%] md:w-[80%] max-sm:w-[80%] text-5xl font-semibold text-center text-stone-800 leading-[53px]"
				>
					Your ideas, our tools—choose the<br/> plan that brings them to life!
				</BlurIn>
                <BlurIn
					duration={1}
					className="text-center w-[60%] text-zinc-700 text-lg max-sm:w-[90%] max-md:text-base max-sm:text-sm"
				>
					From sharing large files with friends to delivering professional client work, RushUpload ensures your creative projects move forward effortlessly.
				</BlurIn>

                <div className='w-[90%] pt-16 flex justify-center gap-[20px] items-center flex-wrap'>
                    {subscriptions.map((sub,i)=>(
                        <div key={i} className={` glass-bg p-5 rounded-2xl w-[360px] flex flex-col gap-2 ${sub.recomend ? 'py-10 border-2 border-[#ff4262] shadow-2xl' :"scale-100"}`}>
                            <span className='text-3xl py-2 font-semibold text-stone-800 max-md:text-4xl max-sm:text-2xl max-sm:leading-[30px] max-sm:font-bold max-md:w-[70%] md:w-[80%] max-sm:w-[80%]'>{sub.type}</span>
                            <span className='text-zinc-600 max-sm:w-[90%] max-md:text-base max-sm:text-sm'>{sub.text}</span> 
                            <span className='text-5xl text-stone-800 font-semibold my-2 max-md:text-4xl max-sm:text-2xl max-sm:leading-[30px] max-sm:font-bold max-md:w-[70%] md:w-[80%] max-sm:w-[80%]'>${sub.price}</span>   
                           
                            <div className='border-t border-stone-500 flex flex-col justify-center items-start gap-2 mb-4 pt-3 '>
                                {sub.features.map((feature,i)=>(
                                    <span key={i} className='text-lg text-zinc-700 font-medium flex gap-2 justify-center items-center max-md:text-base max-sm:text-sm'>
                                        <IoCheckmark className='size-6 text-[#ff4262]'/>{feature}
                                    </span>
                                ))}
                            </div>
                            <PulsatingButton className="text-xl py-4 my-1 font-medium rounded-full max-md:text-base max-sm:text-sm">
                              Subscribe
                            </PulsatingButton>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PricingHero


const subscriptions = [
    {
        type: 'Free',
        price: '0',
        text: 'Perfect for light users or those new to file sharing',
        features: [
            'Upload 2 files at once',
            'Get upto 50Gb of total Storage',
            'Attach upto 2GB per file ',
            'Store your files for 3 days'
            
        ]

    },
    {
        recomend :true,
        type: 'Pro',
        price: '30',
        text: 'The perfect solution for power users to send large files anytime.',
        features: [
            'Upload 5 files at once',
            'Get upto 200Gb of total Storage',
            'Attach upto 15GB per file',
            'Store your files for 7 days'
        ]

    },
    {
        type: 'Premium',
        price: '80',
        text: 'Perfect for teams seeking a tailored file-sharing solution.',
        features: [
            'Upload 10 files at once',
            'Get unlimited Storage',
            'Attach unlimited file size ',
            'Store your files for 1 year'
        ]

    },
]