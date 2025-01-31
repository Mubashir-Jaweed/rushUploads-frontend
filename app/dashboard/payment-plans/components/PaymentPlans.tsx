"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { IoCheckmarkDoneOutline } from "react-icons/io5";

import PulsatingButton from "@/components/ui/pulsating-button";
import { useUserContext } from "@/contexts/user";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const PaymentPlans = () => {
	const { token, user } = useUserContext();
	const [email, setEmail] = useState(`${user?.email}`)
    const [subject, setSubject] = useState(`${user?.email} want to redeem `)
    const [message, setMessage] = useState(`User rewards`)
	const [files, setFiles] = useState([]);


    const sendMail = async (reward : boolean) => {
		if(reward){
			toast.error('Not eligible for reward')
			return
		}
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



	const getFiles = async () => {
		try {
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/files/shared`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				},
			);

			if (response) {
				setFiles(response.data.data.files);
			}
		} catch (error) {
			console.error("Error getting files:", error);
		}
	};

	function truncateString(str: string): string {
		if (str.length > 10) {
		  return str.substring(0, 10) + '...'; // 12 chars + 3 dots = 15
		}
		return str;
	  }

	  function formatRewardNumber(num) {
		if (num < 1000) return num.toString(); // Show as is if less than 1000
		if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'; // Millions
		if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'; // Thousands
		return num.toString();
	  }
	useEffect(() => {
		getFiles()
	}, []);

	return (
		<div className="max-lg:w-[80%] max-sm:w-[90%]  w-[60%] flex flex-col gap-2 justify-start items-start p-5">
			<span className="text-base max-sm:text-sm font-medium text-zinc-600">{user?.email}</span>
			<span className="text-stone-800 text-3xl max-sm:text-2xl font-semibold">
				Payment & Plans
			</span>
			<div className=" w-full border-t my-5 py-5 border-zinc-400 flex flex-col justify-start items-start gap-2 ">
				<span className="text-stone-800 text-xl font-semibold mb-2">
					Current Plan
				</span>
				<div className="border border-zinc-600 w-full rounded-2xl flex flex-col justify-center p-5 items-start">
					<span className="text-stone-800 text-xl font-semibold mb-2 capitalize">
						{user?.tier?.toLocaleLowerCase()}
					</span>
					<span className="flex gap-2 justify-center items-center text-zinc-700 text-lg">
						<IoCheckmarkDoneOutline className="size-6 text-green-600" />
						Send {user?.transferLimit}
					</span>
					<span className="flex gap-2 justify-center items-center text-zinc-700 text-lg">
						<IoCheckmarkDoneOutline className="size-6 text-green-600" />
						Get {user?.totalStorage} Max Storage
					</span>
				</div>
				<span className="text-stone-800 text-xl font-semibold mt-6">
					Files Reward
				</span>

				{files.length > 0 ? <div className="border border-zinc-600  w-full rounded-xl flex flex-col justify-center px-5 items-start">
					{files.map((file, i)=>{

						
						
						return(
						<div key={i} className="border-b text-stone-800 text-lg font-medium py-2 border-stone-500 w-full flex justify-between items-center">
							<span className="flex gap-5">
							<span className=" text-wrap overflow-hidden cursor-pointer max-sm:text-sm" title={file.originalName}>{truncateString(file.originalName)}</span></span>
							<span className="max-sm:text-sm">$ {formatRewardNumber(file.downloads * 0.007)}</span>
							<span className={`underline hover:no-underline max-sm:text-sm ${file.downloads * 0.007 <= 7 ? "cursor-not-allowed": 'cursor-pointer'}`} onClick={()=>sendMail(file.downloads * 0.007 <= 7)}>Redeem</span>
						</div>
					)
					})}
				</div> : <div className="w-full">
					<span className='text-lg text-stone-800'>
						There is no reward history!
					</span>
				</div>}
			</div>

		</div>
	);
};

export default PaymentPlans;
