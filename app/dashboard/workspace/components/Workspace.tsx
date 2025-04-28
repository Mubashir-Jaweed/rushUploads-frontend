"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { HiViewGrid } from "react-icons/hi";
import { IoIosSearch } from "react-icons/io";
import { LuMenu } from "react-icons/lu";

import GridCard from "@/app/dashboard/workspace/components/GridCard";
import ListCard from "@/app/dashboard/workspace/components/ListCard";
import { useUserContext } from "@/contexts/user";
import { toast } from "react-toastify";

type CardData = {
	name: string;
	size: string;
	date: string;
	link: string;
};

const Workspace = () => {
	const tabs = ["shared", "received"];

	const [files, setFiles] = useState<CardData[]>([]);
	const [searchQuerry, setSearchQuerry] = useState("");
	const [underlineStyle, setUnderlineStyle] = useState({});
	const [selectedTab, setSelectedTab] = useState(0);
	const [gridView, setGridView] = useState(false);

	const tabRefs = useRef([]);

	const router = useRouter();

	const { token, user } = useUserContext();

	useEffect(() => {
		const currentTab = tabRefs.current[selectedTab];
		if (currentTab) {
			setUnderlineStyle({
				left: currentTab.offsetLeft,
				width: currentTab.clientWidth,
			});
		}
		getFiles();
	}, [selectedTab]);


	useEffect(() => {
		if (!token) {
			router.push("/upload");
		}
	}, []);

	const filteredFiles = files.filter((file) =>
		file.originalName.toLowerCase().includes(searchQuerry.toLowerCase()),
	);

	const getFiles = async () => {
		try {
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/files/${tabs[selectedTab]}`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				},
			);

			if (response) {
				setFiles(response.data.data.files);
				console.log(response.data.data.files);
			}
		} catch (error) {
			console.error("Error getting files:", error);
		}
	};

	const deleteFile = async (id: string) => {
		try {
			const response = await axios.delete(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/files/${id}`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				},
			);

			if (response) {
				toast('File deleted ')
				setFiles(files.filter((file) => file.id !== id));
			}
		} catch (error) {
			console.error("Error deleting file:", error);
		}
	};

	return (
		<div className="max-lg:w-[80%] max-sm:w-[90%]  w-[60%] h-[80vh] flex flex-col gap-2 justify-start items-start p-5">
			<span className="max-sm:text-sm text-base font-medium text-zinc-600">{user?.email}</span>
			<span className="text-stone-800 max-sm:text-2xl text-3xl font-semibold">
				My Workspace
			</span>
			<div className="relative w-full border-b my-5 pb-1 border-zinc-400 flex justify-between items-end">
				<div className="flex gap-5">
					{tabs.map((val, i) => (
						<span
							key={i}
							ref={(el) => (tabRefs.current[i] = el)}
							onClick={() => setSelectedTab(i)}
							className={`cursor-pointer capitalize max-sm:text-base text-lg ${selectedTab == i ? "font-medium text-zinc-800" : "font-normal text-zinc-700"}`}
						>
							{val}
						</span>
					))}
				</div>
				{/* Underline Element */}
				<div
					className="absolute bottom-0 h-[1.5px] bg-zinc-700 transition-all duration-300 ease-in-out"
					style={{ ...underlineStyle }}
				></div>
				<div className="flex gap-1 items-center justify-center text-stone-800">
					{/* <div className='rounded-[8px] bg-[#32323218] py-2 px-3 h-10 cursor-pointer'>
                        <span className='flex gap-1 justify-center items-center'>Sort by <MdKeyboardArrowDown className='size-6' /></span>
                    </div> */}
					<div className=" max-sm:hidden relative rounded-[8px] max-sm:h-8 h-10 flex justify-center gap-2 items-center bg-[#32323218] px-2">
						<span
							onClick={() => setGridView(false)}
							className={` cursor-pointer`}
						>
							<LuMenu className="size-6 max-sm:size-5" />
						</span>
						<span
							onClick={() => setGridView(true)}
							className={` cursor-pointer`}
						>
							<HiViewGrid className="size-6 max-sm:size-5" />
						</span>
						<span
							className={`absolute rounded border border-zinc-600 max-sm:h-[22px] max-sm:w-[22px] h-7 w-7 delay-3ms transition-all duration-300 ease-in-out ${!gridView ? "left-[6px] max-sm:left-[7px]" : "left-[38px] max-sm:left-[35px]"}`}
						></span>
					</div>
				</div>
			</div>
			<div className="rounded-[8px] upload-input flex justify-between items-center w-full mb-4">
				<IoIosSearch className="text-2xl ml-3 text-stone-600" />
				<input
					type="email"
					value={searchQuerry}
					onChange={(e) => setSearchQuerry(e.target.value)}
					placeholder="Search by file name"
					className="bg-transparent max-sm:text-base text-lg font-normal p-3 outline-none h-full w-[96%]  placeholder:text-zinc-500  text-stone-800"
				/>
			</div>
			<div className=" p-2 w-full flex flex-wrap justify-start items-start gap-2">
				{files.length !== 0 ? (
					filteredFiles.map((val, i) =>
						gridView ? (
							<GridCard
								status={ tabs[selectedTab]}
								deleteFile={() => deleteFile(val.id)}
								key={i}
								data={val}
							/>
						) : (
							<ListCard
								status={tabs[selectedTab]}
								tab
								deleteFile={() => deleteFile(val.id)}
								key={i}
								data={val}
							/>
						),
					)
				) : (
					<div className="text-stone-800 max-sm:text-lg text-xl font-normal  w-full h-28 flex flex-col gap-3 justify-center items-center">
						<span className="text-center">
							All the files you send & recieved will appear here
						</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default Workspace;
