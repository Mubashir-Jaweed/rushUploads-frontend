"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { GoEye } from "react-icons/go";
import { IoLockClosed } from "react-icons/io5";
import { IoLockOpen } from "react-icons/io5";
import { LuEyeClosed } from "react-icons/lu";
import { MdEmail } from "react-icons/md";
import { RiUser3Fill } from "react-icons/ri";
import logo from '../../assets/logo2.png'
import Image from 'next/image';
import { auth } from "@/auth";
import PulsatingButton from "@/components/ui/pulsating-button";
import { formatUser, useUserContext } from "@/contexts/user";
import { googleSignIn } from "@/lib/server";
import { signIn } from "next-auth/react";

const page = () => {
	const router = useRouter();
	const [isHidden, setIsHidden] = useState(true);
	const [isProcessing, setIsProcessing] = useState(false);
	const [message, setMessage] = useState("");
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isSocial, setIsSocial] = useState(false);

	const { token, setToken, setUser } = useUserContext();

	useEffect(() => {
		if (token) {
			router.push("/dashboard/workspace");
		}
	}, [router.push, token]);

	const handleSignup = async () => {
		if (token) return;
		const data = {
			fullName: fullName,
			email: email,
			password: password,
			isSocial: isSocial,
		};
		try {
			setIsProcessing(true);
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/sign-up`,
				data,
				{
					headers: {
						"Content-Type": "application/json",
					},
				},
			);

			if (isSocial) {
				setToken?.(response.data.data.token);
				setUser?.(formatUser(response.data.data.user));

				return router.push("/dashboard/workspace");
			}

			localStorage.setItem("ru_anonymous_id", response.data.data.token);

			return router.push(`/verify?e=${email}`);
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
					Sign up for a free account
				</span>
				<div className="rounded-xl glass-bg flex justify-between items-center w-80">
					<RiUser3Fill className="text-2xl ml-3 text-stone-600" />
					<input
						type="text"
						placeholder="Full Name"
						value={fullName}
						onChange={(e) => setFullName(e.target.value)}
						className="bg-transparent  text-stone-800 text-xl font-normal p-4 outline-none h-full w-[88%]"
					/>
				</div>
				<div className="rounded-xl glass-bg flex justify-between items-center w-80">
					<MdEmail className="text-2xl ml-3 text-stone-600" />
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="bg-transparent  text-stone-800 text-xl font-normal p-4 outline-none h-full w-[88%]"
					/>
				</div>
				<div className="rounded-xl glass-bg flex justify-between items-center w-80">
					{isHidden ? (
						<IoLockClosed className="text-2xl ml-3 text-stone-600" />
					) : (
						<IoLockOpen className="text-2xl ml-3 text-stone-600" />
					)}

					<input
						type={isHidden ? "password" : "text"}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Password"
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
				<PulsatingButton
					onClick={handleSignup}
					className={`text-lg font-medium px-14 py-3 rounded-full flex justify-center items-center ${isProcessing ? "cursor-wait" : "cursor-pointer"}`}
				>
					Continue with Email
				</PulsatingButton>

				<span className="h-line" />
				<button
					type="button"
					className="w-72 rounded-full p-3 bg-white text-lg font-medium"
					onClick={async () => {
						await signIn();

						const { user } = (await auth()) ?? {};

						if (user) {
							// @ts-ignore
							setFullName(user.name);
							// @ts-ignore
							setEmail(user.email);
							setIsSocial(true);

							handleSignup();
						}
					}}
				>
					Continue with Google
				</button>
				<span className="text-center  text-zinc-700 text-lg">
					Already have an account?{" "}
					<Link href={"/login"} className="text-[#1d7fff] underline">
						Sign-in
					</Link>
				</span>
			</div>
		</div>
	);
};

export default page;
