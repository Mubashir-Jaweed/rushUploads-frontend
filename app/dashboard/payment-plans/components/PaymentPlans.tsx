"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { IoCheckmarkDoneOutline } from "react-icons/io5";

import PulsatingButton from "@/components/ui/pulsating-button";
import { useUserContext } from "@/contexts/user";
import { useEffect, useState } from "react";

const PaymentPlans = () => {
	const { token, user } = useUserContext();
	const [rewards, setRewards] = useState({});
	const [linkIds, setLinkIds] = useState<string[]>([]);


	// const subscribeClickHandler = async () => {
	// 	try {
	// 		return router.push("/pricing");
	// 	} catch (error) {
	// 		console.error("Failed to navigate to pricing page:", error);
	// 	}
	// };

	// const portalClickHandler = async () => {
	// 	try {
	// 		const response = await axios.post(
	// 			`${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriptions/portal`,
	// 			{},
	// 			{
	// 				headers: {
	// 					authorization: `Bearer ${token}`,
	// 				},
	// 			},
	// 		);

	// 		const portalUrl = response.data.data.url;

	// 		console.log("Redirecting to portal:", portalUrl);

	// 		window.location.href = portalUrl;
	// 	} catch (error) {
	// 		console.error("Failed to create portal session:", error);
	// 	}
	// };

	const getData = async () => {

		try {
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/rewards`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				},
			);

			if (response) {
				setRewards(response.data.data.groupedRewards);
				console.log(response.data.data.groupedRewards);

				const linkIds = []

				for (const linkId in response.data.data.groupedRewards) {
					linkIds.push(linkId)
				}

				console.log({linkIds})

				setLinkIds(linkIds)
			}
		} catch (error) {
			console.error("Error getting files:", error);
		}
	};

	useEffect(() => {
		getData()
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
					Files Rewards
				</span>

				{linkIds.length > 0 ? <div className="  w-full rounded-xl flex flex-col justify-center px-5 items-start">
					{linkIds.map((linkId, i)=>{

						
						
						return(
						<div key={i} className="border-b text-stone-800 text-lg font-medium py-2 border-stone-500 w-full flex justify-between items-center">
							<span className="flex gap-5"><span>{i + 1}</span>
							<span className="w-40 ">{rewards[linkId]?.title !== "" ? rewards[linkId]?.title : rewards[linkId]?.files?.[0]?.originalName }</span></span>
							<span>$ {rewards[linkId]?.rewards.length / 100}</span>
							<span className="underline hover:no-underline cursor-pointer">Redeem</span>
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
