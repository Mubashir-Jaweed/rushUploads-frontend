"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { GoEye } from "react-icons/go";
import { IoLockClosed } from "react-icons/io5";
import { IoLockOpen } from "react-icons/io5";
import { LuEyeClosed } from "react-icons/lu";

import PulsatingButton from "@/components/ui/pulsating-button";
import { formatUser, useUserContext } from "@/contexts/user";
import { toast } from "react-toastify";

const page = () => {
	const [isProcessing, setIsProcessing] = useState(false);
	const [isHidden, setIsHidden] = useState(true);
	const [message, setMessage] = useState("");
	const [otp, setOtp] = useState("");

	const { token, setToken, setUser } = useUserContext();

	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		if (token) {
			router.push("/dashboard/workspace");
		}
	}, [router.push, token]);

	const resendOtp = async () => {
		const verifyToken = localStorage.getItem("ru_anonymous_id");

		setIsProcessing(true);

		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/resend-otp`,
				{},{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${verifyToken}`,
					},
				},
			);

			if (response) {
				toast.success('OTP Send Successfull')
				
			}
		} catch (error) {
			console.error("Error SignUp:", error);

			// @ts-ignore
			setMessage(error.response?.data.info.message);
		} finally {
			setIsProcessing(false);
		}
	};

	const handleOtp = async () => {
		setMessage('');
		const verifyToken = localStorage.getItem("ru_anonymous_id");

		setIsProcessing(true);

		try {
			const data = {
				otp: otp,
				type: "VERIFY_EMAIL",
			};
			if (searchParams.get("t") === "RESET_PASSWORD") {
				data.type = "RESET_PASSWORD";
			}

			console.log({ verifyToken });

			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-otp`,
				data,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${verifyToken}`,
					},
				},
			);

			localStorage.removeItem("ru_anonymous_id");

			setToken?.(response.data.data.token);
			setUser?.(formatUser(response.data.data.user));

			if (searchParams.get("t") === "RESET_PASSWORD") {
				router.push("/dashboard/profile-security");
			} else {
				router.push("/dashboard/workspace");
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
					Rush Uploads
				</Link>
				<span className="text-center  text-zinc-700 text-lg">
					An email with the code has been sent to <br /> {searchParams.get("e")}
				</span>

				<div className="rounded-xl glass-bg flex justify-between items-center w-80">
					{isHidden ? (
						<IoLockClosed className="text-2xl ml-3 text-stone-600" />
					) : (
						<IoLockOpen className="text-2xl ml-3 text-stone-600" />
					)}

					<input
						type={isHidden ? "password" : "text"}
						value={otp}
						onChange={(e) => setOtp(e.target.value)}
						placeholder="Verification code"
						className="bg-transparent text-stone-800 text-xl font-normal p-4 outline-none h-full w-[88%]"
					/>
					{isHidden ? (
						<LuEyeClosed
							onClick={() => setIsHidden(!isHidden)}
							className="cursor-pointer text-2xl mr-3 text-stone-600"
						/>
					) : (
						<GoEye
							onClick={() => setIsHidden(!isHidden)}
							className="cursor-pointer text-2xl mr-3 text-stone-600"
						/>
					)}
				</div>
				{message && (
					<span className="text-lg text-red-500 text-center">{message}</span>
				)}
				<div className="mb-2 w-80 flex justify-center">
					{/* biome-ignore lint/a11y/useKeyWithClickEvents: <> */}
					<span
						onClick={resendOtp}
						className="text-md text-zinc-400 hover:text-zinc-500 underline cursor-pointer"
					>
						Resend code
					</span>
				</div>
				<PulsatingButton
					onClick={handleOtp}
					className={`text-lg font-medium px-14 py-3 rounded-full flex justify-center items-center ${isProcessing ? "cursor-wait" : "cursor-pointer"}`}
				>
					Submit
				</PulsatingButton>
				<span className="text-center  text-zinc-700 text-lg">
					Dont have an account?{" "}
					<Link href={"/signup"} className="text-[#1d7fff] underline">
						Sign-up
					</Link>
				</span>
			</div>
		</div>
	);
};

export default page;
