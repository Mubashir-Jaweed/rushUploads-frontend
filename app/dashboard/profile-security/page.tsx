import Sidebar from "@/app/dashboard/components/Sidebar";
import ProfileSecurity from "@/app/dashboard/profile-security/components/ProfileSecurity";
import Navbar from "@/components/Navbar";

const page = () => {
	return (
		<>
			<Navbar />
			<div className=" w-full h-screen auth-bg flex items-end">
				<div className=" w-full  h-[87vh] flex  justify-center pt-11  gap-10 overflow-style">
					<ProfileSecurity />
					<Sidebar />
				</div>
			</div>
		</>
	);
};

export default page;
