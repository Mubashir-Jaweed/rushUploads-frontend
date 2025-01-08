"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { MdEmail } from "react-icons/md";

import PulsatingButton from "@/components/ui/pulsating-button";
import { useUserContext } from "@/contexts/user";
import logo from '../../assets/logo2.png'
import Image from "next/image";

const page = () => {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [isProcessing, setIsProcessing] = useState(false);
	const [message, setMessage] = useState("");

	const { token } = useUserContext();

	useEffect(() => {
		if (token) {
			router.push("/dashboard/workspace");
		}
	}, [router.push, token]);

	const resetPassword = async () => {
		if (token) return;

		const data = { email };

		try {
			setIsProcessing(true);

			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/reset-password`,
				data,
				{
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
			console.log(response);
			if (response) {
				localStorage.setItem("ru_anonymous_id", response.data.data.token);

				router.push(`/verify?e=${email}&t=RESET_PASSWORD`);
			}
		} catch (error) {
			console.error("Error SignUp:", error);

			// @ts-ignore
			setMessage(error.response.data.info.message);
		} finally {
			setIsProcessing(false);
		}
	};
	return (
		<div className="auth-bg w-full h-screen flex  justify-center items-center">
			<div className="flex flex-col justify-center items-center gap-5">
				<Link href={"/"} className="font-bold text-2xl ">
				<Image alt="logo" src={logo} className="h-[50px] w-[150px]"/>
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
