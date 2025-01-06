import React from "react";
import BlurIn from "./ui/blur-in";
import { MdOutlineCloudUpload } from "react-icons/md";
import { LuSettings2 } from "react-icons/lu";
import { HiOutlineShare } from "react-icons/hi";
import { FadeText } from "./ui/fade-text";

const About = () => {
	return (
		<div className="py-36 w-full flex justify-center items-center">
			<div className="w-[80%]  flex flex-col justify-center items-center gap-3" >

			<FadeText
			 direction="up"
			 framerProps={{
			   show: { transition: { delay: 0.5 } },
			 }}
				className="text-6xl font-semibold  text-stone-800 leading-[65px]"
			>
				Simple, Secure, and <br/> Seamless File Sharing
			</FadeText>

			<FadeText
			 direction="up"
			 framerProps={{
			   show: { transition: { delay: 0.5 } },
			 }}
				className="text-center w-[60%] text-zinc-700 text-lg"
			>
				We’ve streamlined file sharing into a simple and secure process. Here’s how it works


			</FadeText>
			<div className="w-full flex justify-center items-center gap-10 flex-wrap mt-10" >
				{data.map((val,i)=>(
				<div key={i} className=" flex justify-center items-start flex-col gap-3 w-[350px]">
					<span className="p-3 rounded-full bg-[#ff90a337]">
						{val.icon}
					</span>
					<span className="text-xl font-semibold">
						{val.head}
					</span>
					<span className="text-base text-slate-500">
						{val.text}
					</span>
				</div>
				))}
			</div>
			</div>
		</div>
	);
};




const data = [
	{
		head:"Upload Your Files",
		text:'Drag and drop your files or browse to upload them from your device. Our platform supports various file types and sizes.',
		icon:<MdOutlineCloudUpload className="size-6 text-[#ff4262] "/>

	},
	{
		head:"Set Preferences",
		text:'Add password protection, expiration dates, or choose specific recipients for your files. You’re in full control of how your files are shared.',
		icon:<LuSettings2 className="size-6 text-[#ff4262] "/>

	},
	{
		head:"Share Securely",
		text:'Generate a secure link instantly. Share it via email, and the recipient can download the file effortlessly.',
		icon:<HiOutlineShare className="size-6 text-[#ff4262] "/>

	},
]

export default About;
