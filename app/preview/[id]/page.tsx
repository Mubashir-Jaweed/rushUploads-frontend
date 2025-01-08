"use client";
import React, { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { LuDownload, LuMenu } from "react-icons/lu";
import { HiViewGrid } from "react-icons/hi";
import { IoIosLink, IoIosSearch } from "react-icons/io";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { IoReload } from "react-icons/io5";
import Navbar from "@/components/Navbar";
import ListCard from "@/app/dashboard/workspace/components/ListCard";

const Workspace = () => {
	const API_URL = "https://rushuploads-backend.onrender.com/";
	const [files, setFiles] = useState([]);
	const [searchQuerry, setSearchQuerry] = useState("");
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const router = useRouter();
	const { id } = useParams();

	useEffect(() => {
		getFiles();
	}, []);

	let token: string | null = null;

	useEffect(() => {
		token = localStorage.getItem("token");
		if (!token) {
			router.push("/upload");
		}
	}, []);

	const filteredFiles = files.filter((file) =>
		file.originalName.toLowerCase().includes(searchQuerry.toLowerCase()),
	);

	const getFiles = async () => {
		try {
			const response = await axios.get(`${API_URL}files/link/${id}`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.data.data) {
				setFiles(response.data.data.link.files);
				setTitle(response.data.data.link.title);
				setDescription(response.data.data.link.message);
				console.log(response);
			}
		} catch (error) {
			console.error("Error getting files:", error);
		}
	};

	const copyUrl = (url: string) => {
		navigator.clipboard.writeText(url);
		console.log(url);
	};

	return (
		<div>
			<Navbar />
			<div className=" w-full h-screen auth-bg flex items-end">
				<div className=" w-full  h-[87vh] flex  justify-center pt-11  gap-10 overflow-style">
					<div className="  w-[80%] h-[80vh] flex flex-col gap-2 justify-start items-start p-5">
						{title ? (
							<span className="text-stone-800 text-3xl font-semibold">
								{title}
							</span>
						) : (
							<span className="text-stone-800 text-3xl font-semibold">
								Preview files
							</span>
						)}
						{description && (
							<span className="text-lg font-normal text-zinc-600">
								{description}
							</span>
						)}
						<div className="relative w-full border-b my-5 pb-1 border-zinc-400 flex justify-between items-end">
							{/* Underline Element */}
						</div>
						<div className="rounded-[8px] upload-input flex justify-between items-center w-full mb-4">
							<IoIosSearch className="text-2xl ml-3 text-stone-600" />
							<input
								type="email"
								value={searchQuerry}
								onChange={(e) => setSearchQuerry(e.target.value)}
								placeholder="Search by file name"
								className="bg-transparent   text-lg font-normal p-3 outline-none h-full w-[96%]  placeholder:text-zinc-500  text-stone-800"
							/>
						</div>
						<div className=" p-2 w-full  flex flex-wrap justify-start items-start gap-2">
							{files.length !== 0 ? (
								filteredFiles.map((val, i) => (
									<>
										<div className="hover:bg-[#f5f5f57e] bg-[#f5f5f52d] w-full list-card cursor-pointer flex flex-col  justify-center items-center rounded-[8px] p-3">
											<span className="text-lg font-medium  w-full text-stone-800">
												{val.originalName}
											</span>
											<div className="flex w-full justify-between items-end">
												<div className="flex justify-start items-center gap-3">
													<span className=" text-sm font-normal text-zinc-700">
														{val.updatedAt.split("T")[0]}
													</span>
													{val.isExpired && (
														<>
															{" "}
															<span className=" text-xs font-normal text-zinc-700">
																|
															</span>
															<span className=" text-sm font-normal text-zinc-700">
																Expired
															</span>
														</>
													)}
												</div>
												<div className="flex justify-center items-center ">
													<a
														download={true}
														href={val.url}
														className="list-btn-title-cont delay-5ms hover:bg-[#32323218] text-stone-800 p-2 rounded-full flex justify-center items-center"
													>
														<LuDownload className="size-5" />
														<span className="list-btn-title">Download</span>
													</a>
													<span
														onClick={() => copyUrl(val.url)}
														className="list-btn-title-cont  delay-5ms hover:bg-[#32323218] text-stone-800 p-2 rounded-full flex justify-center items-center"
													>
														<IoIosLink className="size-5" />
														<span className="list-btn-title">Copy_Link</span>
													</span>
												</div>
											</div>
										</div>
									</>
								))
							) : (
								<div className="text-stone-800 text-xl font-normal  w-full h-28 flex flex-col gap-3 justify-center items-center">
									<span className="text-center">
										All the files recieved will appear here
									</span>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Workspace;
