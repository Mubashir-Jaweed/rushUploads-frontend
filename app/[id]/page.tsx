"use client";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { LuDownload, LuMenu } from "react-icons/lu";
import { HiViewGrid } from "react-icons/hi";
import { IoIosLink, IoIosSearch } from "react-icons/io";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { toast } from "react-toastify";
import Link from "next/link";

const Workspace = () => {
	const [files, setFiles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isAds, setIsAds] = useState(true);
	const [adUrl, setAdUrl] = useState('https://chatgpt.com/c/67dafcc3-5d4c-8013-b094-e405a5fd9c9d');
	const [count, setCount] = useState(5);
	const [showClose, setShowClose] = useState(false);
	const intervalRef = useRef<NodeJS.Timeout>();
	const [searchQuerry, setSearchQuerry] = useState("");
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const router = useRouter();
	const { id } = useParams();





	useEffect(() => {
		intervalRef.current = setInterval(() => {
			setCount((prev) => {
				if (prev <= 1) {
					clearInterval(intervalRef.current!);
					setShowClose(true);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};


		getFiles();
	}, []);

	let token: string | null = null;

	const filteredFiles = files.filter((file) =>
		file.originalName.toLowerCase().includes(searchQuerry.toLowerCase()),
	);

	const getFiles = async () => {
		setLoading(true)
		try {
			const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/files/link/${id}`, {
				headers: {
					"Content-Type": "application/json",
					// Authorization: `Bearer ${token}`,
				},
			});

			if (response.data.data) {
				setLoading(false)
				setFiles(response.data.data.link.files);
				setTitle(response.data.data.link.title);
				setDescription(response.data.data.link.message);
			}
		} catch (error) {
			console.error("Error getting files:", error);
			setLoading(false)

		}
	};


	async function increaseDownload(fileId: string) {
		try {
			const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/files/download/${fileId}`, {
			}, {
				headers: {
					"Content-Type": "application/json",
					// Authorization: `Bearer ${token}`,
				},
			});

			if (response) {
				console.log(response)
				// setLoading(false)
				// setFiles(response.data.data.link.files);
				// setTitle(response.data.data.link.title);
				// setDescription(response.data.data.link.message);
			}
		} catch (error) {
			console.error("Error getting 2 files:", error);

		}
	}

	async function downloadFile(fileId: string, url: string, filename: string) {
		increaseDownload(fileId)
		try {
			const response = await fetch(url);

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const blob = await response.blob();
			const blobUrl = URL.createObjectURL(blob);

			// Create a hidden anchor tag
			const a = document.createElement('a');
			a.href = blobUrl;
			a.download = filename; // Force the browser to use this filename
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);

			URL.revokeObjectURL(blobUrl);
		} catch (error) {
			console.error('Error downloading file:', error);
			toast.error('Error in downloading file');
		}
	}


	const copyUrl = (url: string, file: String) => {
		navigator.clipboard.writeText(`https://rushuploads.com/${url}/${file}`);
		toast('Url Copied')
	};

	return (
		<div>
			<Navbar />
			<div className=" w-full h-screen auth-bg flex items-end">
				{isAds &&
					<div className="bg-[#333333] text-gray-400 flex justify-center items-center h-[96%] w-[98%] fixed z-50 top-[2%] left-[1%] rounded-xl">
						<div onClick={() => showClose ? setIsAds(false) : null} className="bg-white cursor-pointer uppercase text-sm font-normal text-stone-900 rounded-xl px-3 py-2 absolute top-3 right-3">
							{showClose ? 'Close Ad' : `Generating Link | ad skip in ${count}`}
						</div>


						<Link href={adUrl} target="_blank" className='adContainer'>
							<iframe
								src={adUrl}
								width="100%"
								height="100%"
								style={{ border: "none" }}
							></iframe>

						</Link>



					</div>
				}
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
							{files.length !== 0 && !loading ? (
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
														onClick={() => downloadFile(val.id, val.url, val.originalName)}
														className="list-btn-title-cont delay-5ms hover:bg-[#32323218] text-stone-800 p-2 rounded-full flex justify-center items-center"
													>
														<LuDownload className="size-6" />
														<span className="list-btn-title">Download</span>
													</a>
													<span
														onClick={() => copyUrl(id, val.id)}

														className="list-btn-title-cont  delay-5ms hover:bg-[#32323218] text-stone-800 p-2 rounded-full flex justify-center items-center"
													>
														<IoIosLink className="size-6" />
														<span className="list-btn-title">Copy_Link</span>
													</span>
												</div>
											</div>
										</div>
									</>
								))
							) : loading ? (
								<div className="w-full flex justify-center">
									<svg width="50px" height="50px" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" fill="none">
										<circle cx="25" cy="25" r="20" stroke="#ff4262" stroke-width="4" stroke-linecap="round" fill="none"
											stroke-dasharray="100" stroke-dashoffset="0">
											<animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25"
												dur="0.5s" repeatCount="indefinite" />
											<animate attributeName="stroke-dashoffset" values="100;0" dur="1s" repeatCount="indefinite" />
										</circle>
									</svg>
								</div>

							) : (

								<div className="text-stone-800 text-xl font-normal  w-full h-28 flex flex-col gap-3 justify-center items-center">
									<span className="text-center">
										Files not found! <span className=" underline cursor-pointer" onClick={() => getFiles()}>Please reload</span>.
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
