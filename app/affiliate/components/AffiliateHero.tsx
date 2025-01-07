import BlurIn from '@/components/ui/blur-in'
import PulsatingButton from '@/components/ui/pulsating-button'
import { IoCheckmark } from "react-icons/io5";

import React from 'react'
import Link from 'next/link';

const AffiliateHero = () => {
    return (
        <div className='h-[60vh] py-20 flex justify-center items-center '>
            <div className='w-[90%] pt-20 flex justify-center items-center flex-col gap-5'>
                <BlurIn
                    duration={0.9}
                    className="max-md:text-4xl max-sm:text-2xl max-sm:leading-[30px] max-sm:font-bold max-md:w-[70%] md:w-[80%] max-sm:w-[80%] text-5xl font-semibold text-center text-stone-800 leading-[53px]"
                >
                    Earn with Our Affiliate Program				</BlurIn>
                <BlurIn
                    duration={1}
                    className="text-center w-[60%] text-zinc-700 text-lg max-sm:w-[90%] max-md:text-base max-sm:text-sm"
                >
                    Welcome to the Rush Uploads Affiliate Program! Here’s your chance to turn your file-sharing into a rewarding experience. With every file you upload, you open the door to earning rewards.				</BlurIn>

                    <BlurIn duration={1.2}>
					<Link href={"/upload"}>
						<PulsatingButton className="max-md:text-base max-sm:text-sm text-lg font-medium px-10 py-3 rounded-full flex justify-center items-center">
							Upload Files
						</PulsatingButton>
					</Link>
				</BlurIn>
            </div>
        </div>
    )
}

export default AffiliateHero

