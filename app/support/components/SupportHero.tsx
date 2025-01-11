'use client'
import BlurIn from '@/components/ui/blur-in'
import PulsatingButton from '@/components/ui/pulsating-button'
import { MdAttachFile } from "react-icons/md";

import React, { useState } from 'react'
import { toast } from 'react-toastify';
import axios from 'axios';

const SupportHero = () => {



    const [email, setEmail] = useState('')
    const [subject, setSubject] = useState('')
    const [message, setMessage] = useState('')


    const sendMail = async () => {
		if (email.length <= 0)
			return toast.error("Email & message required ");

		try {
			const data = {
				email,
                subject,
                message
			};

			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/support`,
				data,
				{
					headers: {
						"Content-Type": "application/json",
					},
				},
			);

			if (response) {
				console.log(response);

			
				toast("Message sent successfully");
			}
		} catch (error) {
			console.error("Error chnage pass:", error.response.data.info.message);
		}
	};


    return (
        <div className='py-20 flex justify-center items-center '>
            <div className='w-[90%] pt-32 flex justify-center items-center flex-col max-sm:gap-2 gap-5'>
                <BlurIn
                    duration={0.9}
                    className="max-md:text-4xl max-sm:text-2xl max-sm:leading-[30px] max-sm:font-bold max-md:w-[70%] md:w-[80%] max-sm:w-[80%] text-5xl font-semibold text-center text-stone-800 leading-[53px]"
                >
                    We're Here to Help
                </BlurIn>
                <BlurIn
                    duration={1}
                    className="text-center w-[60%] text-zinc-700 text-lg max-sm:w-[90%] max-md:text-base max-sm:text-sm"
                >
                    Need assistance? Our support team is ready to help you with any questions or issues. Explore our FAQs, or contact us directly for quick and reliable solutions. We're dedicated to ensuring you have a seamless experience.				</BlurIn>

                <div className='mt-10 flex gap-3 max-md:w-[90%]  w-[600px]  flex-col items-center justify-center '>
                
                    <input
                        type="email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        placeholder="Email"
                        className="max-md:text-base max-sm:text-sm  placeholder:text-zinc-500 upload-input text-stone-800 text-lg font-normal outline-none p-3  w-full rounded-xl"
                    />
                    <input
                        type="text"
                        value={subject}
                        onChange={(e)=>setSubject(e.target.value)}
                        placeholder="Subject"
                        className="max-md:text-base max-sm:text-sm  placeholder:text-zinc-500 upload-input text-stone-800 text-lg font-normal outline-none p-3  w-full rounded-xl"
                    />
                   
                    <textarea
                        placeholder="Detailed Description"
                        value={message}
                        onChange={(e)=>setMessage(e.target.value)}
                        className="max-md:text-base max-sm:text-sm resize-none placeholder:text-zinc-500 upload-input text-stone-800 text-lg font-normal outline-none p-3  w-full rounded-xl"
                    />
                    <input
                        type="file"
                        id='attachment'
                        className='hidden'
                    />
                    

                    <div className='w-full flex justify-center items-center gap-3 mt-3'>
                    <PulsatingButton onClick={sendMail} className="w-full text-lg font-medium px-8 py-4  rounded-full max-md:text-base max-sm:text-sm">
                        Submit
                    </PulsatingButton>
                    <label htmlFor="attachment" className='border-[1.5px] border-stone-800 p-3 rounded-full'><MdAttachFile className='size-7'/></label>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default SupportHero

