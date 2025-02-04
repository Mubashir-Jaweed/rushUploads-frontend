'use client'
import { useUserContext } from "@/contexts/user";
import Link from "next/link";

const Sidebar = () => {


		const { user } = useUserContext();
	
	return (
		<div className="max-lg:hidden w-[15%]  pl-10 p-5">
			<span className="text-xl font-semibold text-stone-800">Dashboard</span>
			<div className="flex justify-center items-start flex-col py-8 gap-1 text-stone-800">
				<Link
					className="text-lg border-b border-zinc-400 py-3 px-1 w-full cursor-pointer"
					href={"/dashboard/workspace"}
				>
					Workspace
				</Link>
				<Link
					className="text-lg border-b border-zinc-400 py-3 px-1 w-full cursor-pointer"
					href={"/dashboard/profile-security"}
				>
					Profile & Security
				</Link>
				<Link
					className="text-lg border-b border-zinc-400 py-3 px-1 w-full cursor-pointer"
					href={"/dashboard/payment-plans"}
				>
					Payment & Plans
				</Link>

				{user?.role == 'ADMIN' && <Link
					className="text-lg border-b border-zinc-400 py-3 px-1 w-full cursor-pointer"
					href={"/admin/dashboard"}
				>
				 Admin Panel
				</Link>}
			</div>
		</div>
	);
};

export default Sidebar;
