"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { IoCheckmarkDoneOutline } from "react-icons/io5";

import PulsatingButton from "@/components/ui/pulsating-button";
import { useUserContext } from "@/contexts/user";
import { useEffect, useState } from "react";

const PaymentPlans = () => {
	const { token, user } = useUserContext();
	const [data, setData] = useState([]);


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

		console.log('hello')
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
				setData(response.data.data.files);
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
				<span className="text-stone-800 text-xl font-semibold my-2">
					Files Rewards
				</span>

				<div className="border border-zinc-600 w-full rounded-xl flex flex-col justify-center p-5 items-start">

				</div>
			</div>
			
		</div>
	);
};

export default PaymentPlans;
