"use client";

import Link from "next/link";
import { MdOutlineMenu } from "react-icons/md";

import PulsatingButton from "@/components/ui/pulsating-button";
import { useUserContext } from "@/contexts/user";
import Image from "next/image";
import logo from '../assets/logo3.png'
import { useEffect, useState } from "react";
const Navbar = () => {

	const [navState, setNavState] = useState(false);
	const [sideBarOpen, setSideBarOpen] = useState(false);



	const onNavScroll = () => {
		if (window.scrollY > 100) {
		  setNavState(true);
		} else {
		 
			setNavState(false);
		
		}
	  };
	
	  useEffect(() => {
		window.addEventListener("scroll", onNavScroll);
	  }, []);


	const { token } = useUserContext();

	return (
		<div className={`${navState ? 'glass-bg h-[10vh]' : 'h-[13vh]'}  delay-5ms fixed z-10 w-full  flex justify-center items-cente`}>
			<div className="w-full   m-5 flex justify-center items-center">
				<div className="w-[80%] py-3  flex justify-between items-center z-10">
					<Link
						href={"/"}
						className="font-bold  text-2xl w-72 flex justify-start items-center"
					>
						<Image alt="logo" src={logo} className="h-[50px] w-[150px]"/>
					</Link>
					<div className="max-lg:hidden flex justify-center items-center gap-2 text-stone-800">
						<Link
							href={"/"}
							className="text-[20px] font-medium px-4 py-2 rounded-2xl delay-5ms hover:bg-[#2d27251a] "
						>
							Home
						</Link>
						<Link
							href={"/upload"}
							className="text-[20px] font-medium px-4 py-2 rounded-2xl delay-5ms hover:bg-[#2d27251a]"
						>
							Upload
						</Link>
						<Link
							href={"/pricing"}
							className="text-[20px] font-medium px-4 py-2 rounded-2xl delay-5ms hover:bg-[#2d27251a]"
						>
							Pricing
						</Link>
						<Link
							href={"/affiliate"}
							className="text-[20px] font-medium px-4 py-2 rounded-2xl delay-5ms hover:bg-[#2d27251a]"
						>
							Affiliate
						</Link>
						<Link
							href={"/support"}
							className="text-[20px] font-medium px-4 py-2 rounded-2xl delay-5ms hover:bg-[#2d27251a]"
						>
							Support
						</Link>
					
					</div>

					{!token ? (
						<div className="max-lg:hidden flex justify-end items-center gap-4 text-stone-800 w-72 ">
							<Link href={"/signup"}>
								<PulsatingButton className="text-lg font-medium px-8 py-3 rounded-full">
									Get started for free
								</PulsatingButton>
							</Link>
						</div>
					) : (
						<div className="max-lg:hidden flex justify-end items-center gap-4 text-stone-800 w-72 ">
							<Link href={"/dashboard/workspace"}>
								<PulsatingButton className="text-lg font-medium px-8 py-3 rounded-full">
									Dashboard
								</PulsatingButton>
							</Link>
						</div>
					)}

					<div onClick={()=>setSideBarOpen(!sideBarOpen)} className="lg:hidden border border-stone-800 p-1 rounded-[10px] ">
						<MdOutlineMenu className="size-7"/>
					</div>
				</div>
			</div>
			<div className={`${sideBarOpen ? 'right-0' :"-right-96"} lg:hidden z-30 absolute w-[350px] delay-5ms  p-5 pt-10 border h-screen bg-zinc-100 flex flex-col justify-start items-start`}>
			<div onClick={()=>setSideBarOpen(!sideBarOpen)} className="lg:hidden border border-stone-800 p-1 rounded-[10px] mb-16 ">
						<MdOutlineMenu className="size-7"/>
					</div>
				<Link href={'/'} className="text-xl text-stone-800 border-t border-stone-300 w-full py-3 hover:bg-zinc-200 px-2">Home</Link>
				<Link href={'/upload'} className="text-xl text-stone-800 border-t border-stone-300 w-full py-3 hover:bg-zinc-200 px-2">Upload</Link>
				<Link href={'/pricing'} className="text-xl text-stone-800 border-t border-stone-300 w-full py-3 hover:bg-zinc-200 px-2">Pricing</Link>
				<Link href={'/affiliate'} className="text-xl text-stone-800 border-t border-stone-300 w-full py-3 hover:bg-zinc-200 px-2">Affiliate</Link>
				<Link href={'/support'} className="text-xl text-stone-800 border-t border-stone-300 w-full py-3 hover:bg-zinc-200 px-2">Support</Link>

				{
					token && (<>
					<span className="py-3 pt-8 text-2xl font-medium text-stone-800">
					Dashboard
				</span>

				<Link href={'/dashboard/workspace'} className="text-xl text-stone-800 border-t border-stone-300 w-full py-3 hover:bg-zinc-200 px-2">Workspace</Link>
				<Link href={'/dashboard/payment-plans'} className="text-xl text-stone-800 border-t border-stone-300 w-full py-3 hover:bg-zinc-200 px-2">Payment & Plans</Link>
				<Link href={'/dashboard/profile-security'} className="text-xl text-stone-800 border-t border-stone-300 w-full py-3 hover:bg-zinc-200 px-2">Profile & Security</Link></>)
				}
			</div>
		</div>
	);
};

export default Navbar;
