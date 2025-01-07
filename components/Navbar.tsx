"use client";

import Link from "next/link";

import PulsatingButton from "@/components/ui/pulsating-button";
import { useUserContext } from "@/contexts/user";

const Navbar = () => {
	const { token } = useUserContext();

	return (
		<div className=" fixed z-10 w-full h-[13vh] flex justify-center items-cente">
			<div className="w-full   m-5 flex justify-center items-center">
				<div className="w-[80%] py-3  flex justify-between items-center z-10">
					<Link
						href={"/"}
						className="font-bold text-2xl w-72 flex justify-start items-center"
					>
						Rush Uploads
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
				</div>
			</div>
		</div>
	);
};

export default Navbar;
