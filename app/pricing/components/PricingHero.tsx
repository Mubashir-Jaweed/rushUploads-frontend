import BlurIn from '@/components/ui/blur-in'
import React from 'react'

const PricingHero = () => {
    return (
        <div className='auth-bg h-screen flex justify-center items-center '>
            <div className='w-[90%]  border flex justify-center items-center flex-col gap-5'>
            <BlurIn
					duration={0.9}
					className="text-5xl font-semibold text-center text-stone-800 leading-[53px]"
				>
					Your ideas, our tools—choose the<br/> plan that brings them to life!
				</BlurIn>
                <BlurIn
					duration={1}
					className="text-center w-[60%] text-zinc-700 text-lg"
				>
					From sharing large files with friends to delivering professional client work, RushUpload ensures your creative projects move forward effortlessly.
				</BlurIn>
            </div>
        </div>
    )
}

export default PricingHero


const subscriptions = [
    {
        type: 'Free',
        price: '0$',
        text: 'Perfect for light users or those new to file sharing',
        features: [
            'Upload 2 files at once',
            'Get upto 50Gb of total Storage',
            'Attach upto 2GB per file ',
            'Store your files for 3 days'
            
        ]

    },
    {
        type: 'Pro',
        price: '30$',
        text: 'The perfect solution for power users who need to send large files anytime, anywhere.',
        features: [
            'Upload 5 files at once',
            'Get upto 200Gb of total Storage',
            'Attach upto 15GB per file',
            'Store your files for 7 days'
        ]

    },
    {
        type: 'Premium',
        price: '80$',
        text: 'Perfect for teams seeking a tailored file-sharing solution.',
        features: [
            'Upload 10 files at once',
            'Get unlimited Storage',
            'Attach unlimited file size ',
            'Store your files for 1 year'
        ]

    },
]