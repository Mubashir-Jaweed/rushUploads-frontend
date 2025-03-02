import UploadHero from "@/app/upload/components/UploadHero";
import Navbar from "@/components/Navbar";

const page = () => {
	return (
		<div>
			<Navbar />
			<UploadHero />
			<div id='upload-l' className="fixed bottom-0 left-0 bg-blue-600 opacity-90 w-[350px] h-[800px] rounded"/>
			<div id='upload-r' className="fixed bottom-0 right-0 bg-blue-600 opacity-90 w-[350px] h-[800px] rounded"/>

		</div>
	);
};

export default page;
