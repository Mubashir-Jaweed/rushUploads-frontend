import PulsatingButton from "@/components/ui/pulsating-button";
import Link from "next/link";
import React from "react";
import { IoCheckmarkDoneOutline } from "react-icons/io5";

const PaymentPlans = () => {
	return (
		<div className=" w-[60%] flex flex-col gap-2 justify-start items-start p-5">
			<span className="text-base font-medium text-zinc-600">
				helloworld@rushuploads.com
			</span>
			<span className="text-stone-800 text-3xl font-semibold">
				Payment & Plans
			</span>
			<div className=" w-full border-t my-5 py-5 border-zinc-400 flex flex-col justify-start items-start gap-2 ">
				<span className="text-stone-800 text-xl font-semibold mb-2">
					Current plan
				</span>
				<div className="border border-zinc-400 w-full rounded-2xl flex flex-col justify-center p-5 items-start">
					<span className="text-stone-800 text-xl font-semibold mb-2">
						Free
					</span>
					<span className="flex gap-2 justify-center items-center text-zinc-700 text-lg">
						<IoCheckmarkDoneOutline className="size-6 text-green-600" />
						Send Upto 2 GB
					</span>
					<span className="flex gap-2 justify-center items-center text-zinc-700 text-lg">
						<IoCheckmarkDoneOutline className="size-6 text-green-600" />
						Get 250 GB max storage
					</span>
					<span className="flex gap-2 justify-center items-center text-zinc-700 text-lg">
						<IoCheckmarkDoneOutline className="size-6 text-green-600" />
						Send Upto 2 GB
					</span>
				</div>
			</div>
			<div className=" w-full border-t my-5 py-5 border-zinc-400 flex flex-col justify-start items-start gap-2 ">
				<span className="text-stone-800 text-xl font-semibold mb-2">
					Need More Capacity?
				</span>
				<span className="flex gap-2 mb-3 justify-center items-center text-zinc-700 text-lg">
					Level up your plan and unlock bigger transfers for smoother teamwork.
				</span>
				<Link href={"/pricing"} target="_blank">
					<PulsatingButton className="text-lg font-medium px-5 py-3 rounded-full">
						Change plan
					</PulsatingButton>
				</Link>
			</div>
		</div>
	);
};

export default PaymentPlans;
