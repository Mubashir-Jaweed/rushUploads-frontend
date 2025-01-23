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

const Workspace = () => {
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

	// useEffect(() => {
	// 	token = localStorage.getItem("token");
	// 	if (!token) {
	// 		router.push("/upload");
	// 	}
	// }, []);

	const filteredFiles = files.filter((file) =>
		file.originalName.toLowerCase().includes(searchQuerry.toLowerCase()),
	);

	const getFiles = async () => {
		console.log(id)
		try {
			const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/files/link/${id}`,{
				headers: {
					"Content-Type": "application/json",
					// Authorization: `Bearer ${token}`,
				},
			});

			if (response.data.data) {
				setFiles(response.data.data.link.files);
				setTitle(response.data.data.link.title);
				setDescription(response.data.data.link.message);
			}
		} catch (error) {
			console.error("Error getting files:", error);
		}
	};

	async function downloadFile(url: string, filename: string) {
			const splitName = filename.split('.')
			
			try {
				// Fetch the file from the S3 URL
				const response = await fetch(url);
	
				// Check if the fetch was successful
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}
	
				// Convert the response to a blob
				const blob = await response.blob();
	
				// Create a URL for the blob
				const blobUrl = URL.createObjectURL(blob);
	
				// Create an anchor element and trigger a download
				const a = document.createElement('a');
				a.href = blobUrl;
				a.download = splitName[0]+'-rush-upload'  || 'downloaded-file';
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
	
				// Revoke the blob URL after the download
				URL.revokeObjectURL(blobUrl);
			} catch (error) {
				toast.error('Error in downloading file')
			}
		}
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
							<span className="text-stone-800 text-3xl max-sm:text-2xl font-semibold">
								{title}
							</span>
						) : (
							<span className="text-stone-800 text-3xl max-sm:text-2xl font-semibold">
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
										<div key={i} className="hover:bg-[#f5f5f57e] bg-[#f5f5f52d] w-full list-card cursor-pointer flex flex-col  justify-center items-center rounded-[8px] p-3">
											<span className="text-lg font-medium overflow-hidden w-full text-stone-800">
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
														onClick={() => downloadFile(val.url, val.originalName)}
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
