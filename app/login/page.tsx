"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { GoEye } from "react-icons/go";
import { IoLockClosed } from "react-icons/io5";
import { IoLockOpen } from "react-icons/io5";
import { LuEyeClosed } from "react-icons/lu";
import { MdEmail } from "react-icons/md";

import PulsatingButton from "@/components/ui/pulsating-button";
import { useUserContext } from "@/contexts/user";

const page = () => {
	const router = useRouter();

	const [isHidden, setIsHidden] = useState(true);
	const [isProcessing, setIsProcessing] = useState(false);
	const [message, setMessage] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isPasswordRequired, setIsPasswordRequired] = useState(false);

	const { token, setToken, setUser } = useUserContext();

	useEffect(() => {
		if (token) {
			router.push("/dashboard/workspace");
		}
	}, [router.push, token]);

	const handleSignin = async () => {
		if (token) return;
		const data = {
			email: email,
		};
		if (isPasswordRequired) {
			Object.assign(data, { password });
		}
		try {
			setIsProcessing(true);

			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/sign-in`,
				data,
				{
					headers: {
						"Content-Type": "application/json",
					},
				},
			);

			if (isPasswordRequired) {
				localStorage.removeItem("ru_anonymous_id");

				setToken?.(response.data.data.token);
				setUser?.(response.data.data.user);

				router.push("/dashboard/workspace");
			} else {
				localStorage.setItem("ru_anonymous_id", response.data.data.token);

				router.push(`/verify?e=${email}`);
			}
		} catch (error) {
			console.error("Error SignUp:", error);
			// @ts-ignore
			if (error.response.data.info.message === "Password Required!") {
				setIsPasswordRequired(true);
			} else {
				// @ts-ignore
				setMessage(error.response.data.info.message);
			}
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
					Your are only a few minutes away
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
				{isPasswordRequired && (
					<>
						<div className="rounded-xl glass-bg flex justify-between items-center w-80">
							{isHidden ? (
								<IoLockClosed className="text-2xl ml-3 text-stone-600" />
							) : (
								<IoLockOpen className="text-2xl ml-3 text-stone-600" />
							)}

							<input
								type={isHidden ? "password" : "text"}
								placeholder="Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
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
						<div className="mb-2 w-80 flex justify-end">
							<Link
								href={"/forgot-password"}
								className="text-md text-[#1d7fff] underline italic"
							>
								Forgot Password?
							</Link>
						</div>
					</>
				)}
				{message && (
					<span className="text-lg text-red-500 text-center">{message}</span>
				)}
				<PulsatingButton
					onClick={handleSignin}
					className={`text-lg font-medium px-14 py-3 rounded-full flex justify-center items-center ${isProcessing ? "cursor-wait" : "cursor-pointer"}`}
				>
					Continue with Email
				</PulsatingButton>
				<span className="h-line" />
				<button
					type="button"
					className="w-72 rounded-full p-3 bg-white text-lg font-medium"
				>
					Continue with Google
				</button>
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
