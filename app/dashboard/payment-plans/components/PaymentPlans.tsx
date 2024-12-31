"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { IoCheckmarkDoneOutline } from "react-icons/io5";

import PulsatingButton from "@/components/ui/pulsating-button";
import { useUserContext } from "@/contexts/user";

const PaymentPlans = () => {
	const { token, user } = useUserContext();

	const router = useRouter();

	const subscribeClickHandler = async () => {
		try {
			return router.push("/pricing");
		} catch (error) {
			console.error("Failed to navigate to pricing page:", error);
		}
	};

	const portalClickHandler = async () => {
		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriptions/portal`,
				{},
				{
					headers: {
						authorization: `Bearer ${token}`,
					},
				},
			);

			const portalUrl = response.data.data.url;

			console.log("Redirecting to portal:", portalUrl);

			window.location.href = portalUrl;
		} catch (error) {
			console.error("Failed to create portal session:", error);
		}
	};

	return (
		<div className=" w-[60%] flex flex-col gap-2 justify-start items-start p-5">
			<span className="text-base font-medium text-zinc-600">{user?.email}</span>
			<span className="text-stone-800 text-3xl font-semibold">
				Payment & Plans
			</span>
			<div className=" w-full border-t my-5 py-5 border-zinc-400 flex flex-col justify-start items-start gap-2 ">
				<span className="text-stone-800 text-xl font-semibold mb-2">
					Current Plan
				</span>
				<div className="border border-zinc-400 w-full rounded-2xl flex flex-col justify-center p-5 items-start">
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
			</div>
			{/* <div className=" w-full border-t my-5 py-5 border-zinc-400 flex flex-col justify-start items-start gap-2 ">
				<span className="text-stone-800 text-xl font-semibold mb-2">
					Need More Capacity?
				</span>
				<span className="flex gap-2 mb-3 justify-center items-center text-zinc-700 text-lg">
					Level up your plan and unlock bigger transfers for smoother teamwork.
				</span>
				<PulsatingButton
					className="text-lg font-medium px-5 py-3 rounded-full"
					onClick={
						user?.tier === "FREE" ? subscribeClickHandler : portalClickHandler
					}
				>
					Change Plan
				</PulsatingButton>
			</div> */}
		</div>
	);
};

export default PaymentPlans;
