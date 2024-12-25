"use client";

import PulsatingButton from "@/components/ui/pulsating-button";
import axios from "axios";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { GoEye } from "react-icons/go";
import { IoLockClosed } from "react-icons/io5";
import { IoLockOpen } from "react-icons/io5";
import { LuEyeClosed } from "react-icons/lu";
import { MdEmail } from "react-icons/md";

const page = () => {
	const router = useRouter();
	const token = localStorage.getItem("token");
	const API_URL = "https://rushuploads-backend.onrender.com/";
	const [email, setEmail] = useState("");
	const [isProcessing, setIsProcessing] = useState(false);
	const [message, setMessage] = useState("");

	useEffect(() => {
		if (token) {
			router.push("/dashboard/workspace");
		}
	}, []);

	const resetPassword = async () => {
		if (token) return;
		const data = {
			email: email,
		};

		try {
			setIsProcessing(true);
			const response = await axios.post(`${API_URL}auth/reset-password`, data, {
				headers: {
					"Content-Type": "application/json",
				},
			});
			console.log(response);
			if (response) {
				setIsProcessing(false);
				localStorage.setItem("ru_anonymous_id", response.data.data.token);
				router.push(`/verify?e=${email}&t=RESET_PASSWORD`);
			}
		} catch (error) {
			console.error("Error SignUp:", error.response);

			setIsProcessing(false);
			setMessage(error.response.data.info.message);
			// throw error;
		}
	};
	return (
		<div className="auth-bg w-full h-screen flex  justify-center items-center">
			<div className="flex flex-col justify-center items-center gap-5">
				<Link href={"/"} className="font-bold text-2xl ">
					Rush Uploads
				</Link>
				<span className="text-center  text-zinc-700 text-lg">
					Enter your email, and we’ll send you a<br /> verification code to
					reset your password.
				</span>
				<div className="rounded-xl glass-bg flex justify-between items-center w-80">
					<MdEmail className="text-2xl ml-3 text-stone-600" />
					<input
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						type="email"
						placeholder="Email"
						className="bg-transparent  text-stone-800 text-xl font-normal p-4 outline-none h-full w-[88%]"
					/>
				</div>

				{message && (
					<span className="text-lg text-red-500 text-center">{message}</span>
				)}
				<PulsatingButton
					onClick={resetPassword}
					className={`text-lg font-medium px-14 py-3 rounded-full flex justify-center items-center ${isProcessing ? "cursor-wait" : "cursor-pointer"}`}
				>
					Continue with Email
				</PulsatingButton>
			</div>
		</div>
	);
};

export default page;
