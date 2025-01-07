import React from 'react'
import { FadeText } from './ui/fade-text'
import Link from 'next/link'
import PulsatingButton from './ui/pulsating-button'
import Particles from './ui/particles'
const TryIt = () => {
    return (
        <div className='w-full try-it flex justify-center items-center  '>
            <Particles
                className="absolute z-0 h-[100%] w-full"
                quantity={100}
                ease={80}
                refresh
            />
            <div className='max-md:w-[90%] max-sm:w-[97%] max-md:px-5 max-md:py-10 w-[80%] rounded-3xl bg-stone-800 p-20 flex flex-col justify-center items-center gap-5'>

                <span className="max-md:text-4xl max-sm:text-2xl max-sm:leading-[30px] max-sm:font-bold max-md:w-[70%] md:w-[90%] max-sm:w-[100%] text-6xl font-semibold text-center text-zinc-200 leading-[55px]"
                >
                    <FadeText
                        direction="up"
                        framerProps={{
                            show: { transition: { delay: 0.5 } },
                        }}
                    >
                        Elevate Your File<br /> Sharing Experience                    </FadeText>
                </span>
                <span className="max-sm:w-[80%] max-md:text-base max-sm:text-sm text-[#ff4262eb] text-lg text-center w-[60%]"> <FadeText
                    direction="up"
                    framerProps={{
                        show: { transition: { delay: 0.5 } },
                    }}

                >
                    Say goodbye to limits and hello to effortless sharing. Discover a smarter, faster, and more secure way to manage your files today. Let’s make collaboration seamless!

                </FadeText></span>
                <div className='flex gap-5 mt-5 z-10'>
                    <Link href={"/signup"}>
                        <PulsatingButton deleteBtn={true} className="max-md:text-base max-sm:text-sm text-lg font-medium px-8 py-3 rounded-full  " >
                            Get started
                        </PulsatingButton>
                    </Link>
                    <Link href={"/upload"} className='max-md:text-base max-sm:text-sm text-lg font-medium px-8 py-[10px] flex justify-center items-center border-2 border-[#ff4262] rounded-full text-zinc-100 delay-5ms hover:scale-[1.04]'>
                        Check demo
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default TryIt

