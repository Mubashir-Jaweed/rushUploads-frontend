import Navbar from "@/components/Navbar";
import { div } from "framer-motion/client";
import React from "react";
import Workspace from "./components/Workspace";
import Sidebar from "../components/Sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const page = async () => {
	const session = await auth();

	if (!session) {
		return redirect("/login");
	}

	console.log({ session: session.user });

	return (
		<div>
			<Navbar />
			<div className=" w-full h-screen auth-bg flex items-end">
				<div className=" w-full  h-[87vh] flex  justify-center pt-11  gap-10 overflow-style">
					<Workspace />
					<Sidebar />
				</div>
			</div>
		</div>
	);
};

export default page;
