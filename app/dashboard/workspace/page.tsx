import Sidebar from "@/app/dashboard/components/Sidebar";
import Workspace from "@/app/dashboard/workspace/components/Workspace";
import Navbar from "@/components/Navbar";

const page = async () => {
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
