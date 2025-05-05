"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { FiDownload, FiDollarSign, FiCreditCard } from "react-icons/fi";
import { FaDollarSign } from "react-icons/fa6";

import PulsatingButton from "@/components/ui/pulsating-button";
import { useUserContext } from "@/contexts/user";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const PaymentPlans = () => {
	const { token, user } = useUserContext();
	const [email, setEmail] = useState(`${user?.email}`);
	const [subject, setSubject] = useState(`${user?.email} want to redeem reward `);
	const [message, setMessage] = useState('');
	const [files, setFiles] = useState([]);

	const sendMail = async (reward) => {
		if (reward < 10) {
			toast.error('Not eligible for reward');
			return;
		}
		try {
			setMessage(`${user?.email} uploads total files ${stats.remainingBalance}`)
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

	function formatRewardNumber(num) {
		if (num < 1000) return num.toString();
		if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
		if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
		return num.toString();
	}

	const generateCSV = (files) => {
		const header = "File Name,Claims,Downloads,Earnings (USD),Uploaded By\n";
		const rows = files.map(file => {
		  const fileName = file.originalName;
		  const claims = file.downloadedAt.length;
		  const downloads = file.downloads;
		  const earnings = (claims * 0.007).toFixed(3);
		  const uploadedBy = file.user?.profile?.fullName || file.user?.email || "Unknown";
	  
		  return `${fileName},${claims},${downloads},${earnings},${uploadedBy}`;
		});
	  
		const csv = header + rows.join("\n");
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
	  
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", "rushuploads-report.csv");
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	  };
	  


	// Calculate stats from files
	const calculateStats = () => {
		const totalFiles = files.length;
		const totalDownloads = files.reduce((sum, file) => sum + file.downloads, 0);
		const totalClaims = files.reduce((sum, file) => sum + file.claims, 0);
		const downloadEarnings = totalDownloads * 0.007;
		const claimedEarnings = totalClaims * 0.007;
		const remainingBalance = downloadEarnings - claimedEarnings;

		return {
			totalFiles,
			totalDownloads,
			totalClaims,
			downloadEarnings: downloadEarnings.toFixed(3),
			claimedEarnings: claimedEarnings.toFixed(3),
			remainingBalance: remainingBalance.toFixed(3)
		};
	};

	const stats = calculateStats();

	useEffect(() => {
		getFiles();
	}, []);

	return (
		<div className="max-lg:w-[80%] max-sm:w-[90%] w-[60%] flex flex-col gap-2 justify-start items-start p-5">
			<span className="text-base max-sm:text-sm font-medium text-zinc-600">{user?.email}</span>
			<span className="text-stone-800 text-3xl max-sm:text-2xl font-semibold">
				Payment & Plans
			</span>

			{/* Stats Boxes */}
			<div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
				{/* Total Claims */}
				<div className="glass-bg rounded-xl p-4 border border-white/10">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded bg-stone-800/10">
							<FiDownload className="text-stone-800 size-5" />
						</div>
						<div>
							<h3 className="text-sm font-medium text-zinc-500">Total Claims</h3>
							<p className="text-xl font-bold text-stone-800">{formatRewardNumber(stats.totalClaims)}</p>
						</div>
					</div>
				</div>

				{/* Download Earnings */}
				<div className="glass-bg rounded-xl p-4 border border-white/10">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded bg-stone-800/10">
							<FiDollarSign className="text-stone-800 size-5" />
						</div>
						<div>
							<h3 className="text-sm font-medium text-zinc-500">Download Earnings</h3>
							<p className="text-xl font-bold text-stone-800">${stats.downloadEarnings}</p>
						</div>
					</div>
				</div>

				{/* Claimed Earnings */}
				<div className="glass-bg rounded-xl p-4 border border-white/10">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded bg-stone-800/10">
							<FiCreditCard className="text-stone-800 size-5" />
						</div>
						<div>
							<h3 className="text-sm font-medium text-zinc-500">Claimed Earnings</h3>
							<p className="text-xl font-bold text-stone-800">${stats.claimedEarnings}</p>
						</div>
					</div>
				</div>

				{/* Remaining Balance */}
				<div className="glass-bg rounded-xl p-4 border border-white/10">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded bg-stone-800/10">
							<FaDollarSign className="text-stone-800 size-5" />
						</div>
						<div>
							<h3 className="text-sm font-medium text-zinc-500">Remaining Balance</h3>
							<p className="text-xl font-bold text-stone-800">${stats.remainingBalance}</p>
						</div>
					</div>
				</div>

				{/* Withdraw Button Container - spans full width on mobile, aligns with grid on desktop */}
				<div className="md:col-span-3 flex flex-col gap-2 pl-1">
					<div className="flex gap-5">
						<button
							onClick={() => sendMail(stats.remainingBalance)}
							className="bg-stone-800 hover:bg-stone-700 transition-colors rounded-xl text-zinc-100 font-medium cursor-pointer px-6 py-3 w-full md:w-max"
						>
							Withdraw Amount
						</button>
						<button onClick={() => generateCSV(files)} className="font-medium text-[17px] hover:underline">Download CSV</button>
					</div>
					<p className="text-xs text-zinc-600">
						Minimum $10 required for withdrawal
					</p>
				</div>
			</div>
			{/* Current Plan Section */}
			<div className="w-full border-t my-5 py-5 border-zinc-400 flex flex-col justify-start items-start gap-2">
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
			</div>
		</div>
	);
};

export default PaymentPlans;