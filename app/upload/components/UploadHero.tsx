"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { GoEye } from "react-icons/go";
import { IoClose, IoLockClosed, IoLockOpen } from "react-icons/io5";
import { IoCloudDoneOutline } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { LuEyeClosed } from "react-icons/lu";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import { SlCloudUpload } from "react-icons/sl";
import { toast } from "react-toastify";

import AnimatedCircularProgressBar from "@/components/ui/animated-circular-progress-bar";
import GridPattern from "@/components/ui/grid-pattern";
import PulsatingButton from "@/components/ui/pulsating-button";
import WordRotate from "@/components/ui/word-rotate";
import { cn, formatFileSize } from "@/lib/utils";
import { formatUser, useUserContext } from "@/contexts/user";
import { list } from "postcss";
import { title } from "process";

const UploadHero = () => {
	const [files, setFiles] = useState<File[]>([]);
	const [senderEmails, setSenderEmails] = useState<string[]>([]);
	const [email, setEmail] = useState("");
	const [emailTo, setEmailTo] = useState("");
	const [subject, setSubject] = useState("");
	const [message, setMessage] = useState("");
	const [isSentToEmail, setIsSentToEmail] = useState(true);
	const [isFileUploaded, setIsFileUploaded] = useState(false);
	const [verificationInProgress, setVerificationInProgress] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [responseId, setResponseId] = useState("");
	const [progress, setProgress] = useState(0);
	const [isHidden, setIsHidden] = useState(true);
	const [otp, setOtp] = useState("");
	const [isProcessing, setIsProcessing] = useState(false);
	const router = useRouter();
	const { token, user, setToken, setUser } = useUserContext();
	let verifyToken: string | null = null;
	let filesData = [];


	const [isAds, setIsAds] = useState(false);
		const [redirectUrl, setRedirectUrl] = useState('');
		const [adBannerUrl, setAdBannerUrl] = useState('');
		const [count, setCount] = useState(5);
		const [showClose, setShowClose] = useState(false);
		const intervalRef = useRef<NodeJS.Timeout>();

	useEffect(() => {
		verifyToken = localStorage.getItem("ru_anonymous_id");
	});




	useEffect(() => {
		const fetchSettings = async () => {
			try {
				const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/settings`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setIsAds(response.data.data.value === 'ON' ? true : false);
				setRedirectUrl(response.data.data.redirectUrl ?? '')
				setAdBannerUrl(response.data.data.bannerUrl ?? '')
			} catch (error) {
				// toast.error('Failed to fetch monetization');
				console.error('Failed to fetch monetization:', error);
			}
		};

		fetchSettings();
	}, [token]);


		useEffect(() => {
	
			
	
	
		}, []);
const startAdCount = ()=>{
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
}

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop: (acceptedFiles) => {
			setFiles(acceptedFiles);
		},
	});

	const handleUpload = async (e) => {
		filesData = [];
		if (files.length < 1) {
			toast.error("No file selected!");
			return;
		}
		if (token == null && email.length <= 0) {
			toast.error("Email is required!");
			return;
		}
		if (isSentToEmail) {
			if (emailTo.length <= 0 && senderEmails.length <= 0) {
				toast.error("Sender email required!");
				return;
			}
		}

		if (!token && email.length > 0) {
			quickSignUp();
			return
		}

		setIsProcessing(true);
		setProgress(0);
		setIsUploading(true);

		if(isAds){
			startAdCount()
		}

		try {
			for (const file of files) {
				await handleMultiUpload(file);
			}

			// Proceed with generating file link or sending email after all uploads are done
			if (isSentToEmail) {
				await sendToMail();
			} else {
				await createFileLink();
			}

			setProgress(100); // Set progress to 100% on successful completion
		} catch (error) {
			console.error("Error in handleUpload:", error);
			if(error.response.data.info.message = 'File Contain Virus'){
				toast.error(error.response.data.info.message);
			}else{
				toast.error("Upload failed. Please try again.");
			}
			setIsUploading(false);
		} finally {
			setIsProcessing(false);
		}
	};

	const handleMultiUpload = async (file) => {
		const fileName = file.name;
		const splitFile = fileName.split(".");
		const type = splitFile[splitFile.length - 1];
		let key = "";
		let uploadId = "";

		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/files/start`,
				{
					originalName: fileName,
					mimeType: type,
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response) {
				key = response.data.data.key;
				uploadId = response.data.data.uploadId;
				await uploadFileChunks(file, key, uploadId);
			}
		} catch (error) {
			console.error("Error in handleMultiUpload:", error);
			throw error;
		}
	};

	const uploadFileChunks = async (file, key, uploadId) => {
		const CHUNK_SIZE = 30 * 1024 * 1024; // 30 MB
		const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
		let uploadedParts = [];

		try {
			for (let index = 0; index < totalChunks; index++) {
				const start = index * CHUNK_SIZE;
				const end = Math.min(file.size, start + CHUNK_SIZE);
				const chunk = file.slice(start, end);

				const formData = new FormData();
				formData.append("key", key);
				formData.append("uploadId", uploadId);
				formData.append("chunkNumber", index + 1);
				formData.append("file", chunk);

				const response = await axios.post(
					`${process.env.NEXT_PUBLIC_BACKEND_URL}/files/upload`,
					formData,
					{
						headers: {
							"Content-Type": "multipart/form-data",
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (response) {
					const data = {
						ETag: JSON.parse(response.data.data.eTag),
						PartNumber: index + 1,
					};
					uploadedParts.push(data);

					// Update progress as chunks are uploaded
					setProgress(Math.round(((index + 1) / totalChunks) * 100));
				}
			}

			await finalizeMultipartUpload(file, key, uploadId, uploadedParts);
		} catch (error) {
			console.error("Error in uploadFileChunks:", error);
			throw error;
		}
	};

	const finalizeMultipartUpload = async (file, key, uploadId, uploadedParts) => {
		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/files/finalize`,
				{
					key,
					uploadId,
					uploadedParts,
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response) {
				const fileName = file.name;
				const splitFile = fileName.split(".");
				const type = splitFile[splitFile.length - 1];

				const fileData = {
					originalName: fileName,
					name: key,
					type: type,
					size:file.size
				};
				filesData.push(fileData);
			}
		} catch (error) {
			console.error("Error in finalizeMultipartUpload:", error);
			toast.error("Error finalizing file upload. Please try again.");
			throw error;
		}
	};

	const createFileLink = async () => {
		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/files/link`,
				{
					title: subject,
					message: message,
					expiresInDays: "365",
					files: filesData,
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					onUploadProgress: (ProgressEvent) => {
						setProgress(
							Math.round(
								(ProgressEvent.loaded * 100) / (ProgressEvent.total ?? 1)
							)
						);
					},
				}
			);

			if (response) {
				setResponseId(response.data.data.link.id);
				setIsFileUploaded(true);
				resetForm();
			}
		} catch (error) {
			console.error("Error in createFileLink:", error);
			toast.error("Error creating file link. Please try again.");
			throw error;
		}
	};

	const sendToMail = async () => {
		let sendTo = "";

		try {
			if (senderEmails.length > 0) {
				sendTo = senderEmails.join(",");
			} else {
				sendTo = emailTo;
			}

			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/files/mail`,
				{
					to: sendTo,
					title: subject,
					message: message,
					expiresInDays: "365",
					files: filesData,
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					onUploadProgress: (ProgressEvent) => {
						setProgress(
							Math.round(
								(ProgressEvent.loaded * 100) / (ProgressEvent.total ?? 1)
							)
						);
					},
				}
			);

			if (response) {
				setIsFileUploaded(true);
				resetForm();
			}
		} catch (error) {
			console.error("Error in sendToMail:", error);
			toast.error("Error sending email. Please try again.");
			throw error;
		}
	};

	const resetForm = () => {
		setFiles([]);
		setEmail("");
		setEmailTo("");
		setSubject("");
		setMessage("");
		setProgress(0);
	};


	const handleOtp = async (e) => {
		setIsProcessing(true);
		console.log('handle otp')
		try {
			const data = {
				otp: otp,
				type: "VERIFY_EMAIL",
			};

			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-otp`,
				data,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${verifyToken}`,
					},
				},
			);

			if (response) {
				localStorage.removeItem("ru_anonymous_id");
				setToken?.(response.data.data.token);
				setVerificationInProgress(false);
				setUser?.(formatUser(response.data.data.user));
			}
		} catch (error) {
			// @ts-ignore
			toast.error(error.response.data.info.message)
			console.error("Error SignUp:", error);
		} finally {
			setIsProcessing(false);
		}
	};

	const quickSignUp = async () => {
		if (token) {
			return
		}
		setIsProcessing(true);
		console.log('quick sign up _______________________________________________')
		const data = {
			email: email,
		};
		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/sign-up`,
				data,
				{
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
			if (response) {

				localStorage.setItem("ru_anonymous_id", response.data.data.token);
				setVerificationInProgress(true);
				setIsProcessing(false);

			}
		} catch (error) {
			toast.error('Network problem!')
			console.error("Error Quick SignUp:", error);
			setIsProcessing(true);

		}
	};

	const removeSelectedFile = (idx: number) => {
		setFiles(files.filter((val, i) => i !== idx));
	};

	const removeSenderMails = (idx: number) => {
		setSenderEmails(senderEmails.filter((val, i) => i !== idx));
	};

	const mergeFiles = (newFiles: FileList | null) => {
		if (newFiles) {
			setFiles((prevFiles) => [...prevFiles, ...Array.from(newFiles)]);
		}
	};

	const addEmailsToSenderList = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && emailTo.length > 0) {
			if (
				senderEmails.length < 5 &&
				emailTo.includes("@") &&
				emailTo.includes(".")
			) {
				senderEmails.push(emailTo);
				setEmailTo("");
			}
			return;
		}
	};

	const resendOtp = async () => {
		const verifyToken = localStorage.getItem("ru_anonymous_id");

		setIsProcessing(true);

		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/resend-otp`,
				{}, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${verifyToken}`,
				},
			},
			);

			if (response) {
				toast.success('OTP Send Successfull')

			}
		} catch (error) {
			console.error("Error SignUp:", error);

			// @ts-ignore
			setMessage(error.response?.data.info.message);
		} finally {
			setIsProcessing(false);
		}
	};

	const sendMore = () => {
		setIsUploading(false);
		setIsFileUploaded(false);
	};

	const navigateTo = (route: string) => {
		router.push(route);
	};

	const copyUrl = (url: string) => {
		navigator.clipboard.writeText(url);
		toast('Url Copied')
	};

	return (
		<div className="bg-white w-full p-3">
			<GridPattern
				width={40}
				height={40}
				x={-1}
				y={-1}
				className={cn(
					"[mask-image:linear-gradient(to_bottom_top,white,transparent,transparent)] ",
				)}
			/>
			<div className="h-[100%] w-[100%] py-32  hero-bg rounded-xl flex  justify-center items-center">
			{isAds && isUploading && token ?(
					<div className="bg-[#333333] text-gray-400 flex justify-center items-center h-[96%] w-[98%] fixed z-50 top-[2%] left-[1%] rounded-xl overflow-hidden">
						<div
							onClick={() => showClose ? setIsAds(false) : null}
							className="bg-white cursor-pointer uppercase text-sm font-normal text-stone-900 rounded-xl px-3 py-2 absolute top-3 right-3 z-10"
						>
							{showClose ? 'Close Ad' : `Prepare to upload | ad skip in ${count}`}
						</div>

						<div className=" relative  h-[90%] w-[90%] flex justify-center items-center">
							<a
								href={redirectUrl}
								target="_blank"
								rel="noopener noreferrer"
								
							>
								{/* Video Player Section */}
								{['.mp4', '.webm', '.mov'].some(ext => adBannerUrl.includes(ext)) ? (
									<video
										autoPlay
										muted
										loop
										controls={false}
										className="max-w-[80%] min-w-[500px] max-h-[90%] object-cover rounded"
										onError={(e) => console.error('Video failed to load', e)}
									>
										<source src={adBannerUrl} type={`video/${adBannerUrl.split('.').pop()}`} />
										Your browser does not support the video tag.
									</video>
								) : adBannerUrl.endsWith('.html') ? (
									<iframe
										src={adBannerUrl}
										className="max-w-[80%] min-w-[500px] max-h-[90%] object-cover rounded border-none"
										title="Advertisement"
									/>
								) : (
									<img
										src={adBannerUrl}
										alt="Advertisement"
										className="max-w-[80%] min-w-[500px] max-h-[90%] rounded object-contain"
										onError={(e) => {
											e.currentTarget.src = '/fallback-ad-image.jpg';
										}}
									/>
								)}
							</a>
						</div>
					</div>
				) : null}



				{/*if btn press shoew progress else show form */}
				{isUploading ? (
					isFileUploaded ? (
						<div className="max-md:mx-1   mt-10 glass-bg p-5 delay-5ms flex gap-2  w-[600px] h-[700px] flex-col items-center justify-center overflow-hidden rounded-2xl shadow-2xl">
							<IoCloudDoneOutline className="size-32 m-2" />
							<span className="text-2xl font-semibold text-stone-800">
								That’s a wrap!
							</span>
							{isSentToEmail ? (
								<span className="max-sm:text-sm text-center ">
									The email has been delivered.{" "}
									<Link
										href={"/dashboard/workspace"}
										className="underline text-zinc-700"
									>
										Explore its contents
									</Link>
									.
								</span>
							) : (
								<span className="max-sm:text-sm text-zinc-600 text-lg font-normal text-center">
									Grab your download link or{" "}
									<Link href={`/${responseId}`} className="underline text-zinc-700">
										explore your files!
									</Link>
								</span>
							)}
							{!isSentToEmail && (
								<span className="text-zinc-700 text-base font-normal max-sm:hidden border max-sm:text-xs border-zinc-500 rounded-[8px] text-center p-3 my-3 min-w-[80%]">
									https://rushuploads.com/{responseId}
								</span>
							)}
							{isSentToEmail ? (
								<PulsatingButton
									onClick={() => navigateTo("dashboard/workspace")}
									className=" max-md:text-base max-sm:text-sm text-lg font-medium p-3 w-[80%] my-2 rounded-full flex justify-center items-center"
								>
									Go to dashboard
								</PulsatingButton>
							) : (
								<PulsatingButton
									onClick={() => copyUrl(`https://rushuploads.com/${responseId}`)}
									className=" max-md:text-base max-sm:text-sm text-lg font-medium p-3 w-[80%] my-2 rounded-full flex justify-center items-center"
								>
									Copy link
								</PulsatingButton>
							)}
							{/* biome-ignore lint/a11y/useKeyWithClickEvents: <> */}
							<span
								onClick={() => sendMore()}
								className="max-sm:text-sm text-zinc-700 text-lg font-normal cursor-pointer underline"
							>
								Send more files?
							</span>
						</div>
					) : (
						<div className="max-md:mx-1  mt-10 glass-bg p-5 delay-5ms flex gap-2  w-[600px] h-[700px] flex-col items-center justify-center overflow-hidden rounded-2xl shadow-2xl ">
							<AnimatedCircularProgressBar
								max={100}
								min={0}
								value={progress}
								gaugePrimaryColor="#27272a"
								gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
							/>

							<div className="flex flex-col justify-center items-center">
								<span className="text-base text-zinc-700 font-medium text-center">
									Sending {files.length} files
								</span>
								<WordRotate
									duration={3000}
									className="text-3xl font-bold text-stone-800 dark:text-white"
									words={[
										" Uploading...",
										" Almost completed...",
										" Finalizing...",
									]}
								/>
								<span className="text-base text-zinc-500  text-center">
									Do not close this window until the file uploaded
								</span>
							</div>
						</div>
					)
				) : verificationInProgress ? (
					<div className="max-md:mx-1  mt-10 glass-bg p-5 delay-5ms flex gap-1  w-[600px] h-[700px]  flex-col items-center justify-center overflow-hidden rounded-2xl shadow-2xl ">
						<MdOutlineMarkEmailUnread className="size-32 m-2" />
						<span className="text-2xl font-semibold text-stone-800">
							Verify Email!
						</span>
						<span className="text-center  text-zinc-700 text-lg">
							An email with the code has been sent to <br /> {email}
						</span>

						<div className="rounded-xl glass-bg flex justify-between items-center w-[80%]">
							{isHidden ? (
								<IoLockClosed className="text-2xl ml-3 text-stone-600" />
							) : (
								<IoLockOpen className="text-2xl ml-3 text-stone-600" />
							)}

							<input
							onKeyDown={(e) => {
								if (e.key === "Enter") {
								  handleOtp(e);
								}
							  }}
								type={isHidden ? "password" : "text"}
								value={otp}
								onChange={(e) => setOtp(e.target.value)}
								placeholder="Verification code"
								className="bg-transparent text-stone-800 text-xl font-normal p-4 outline-none h-full w-[88%]"
							/>
							{isHidden ? (
								<LuEyeClosed
									onClick={() => setIsHidden(!isHidden)}
									className="cursor-pointer text-2xl mr-3 text-stone-600"
								/>
							) : (
								<GoEye
									onClick={() => setIsHidden(!isHidden)}
									className="cursor-pointer text-2xl mr-3 text-stone-600"
								/>
							)}
						</div>
						<div className="mb-2 w-80 flex justify-center">
							<span className="text-md text-zinc-400 ">
								Did not get the code? <span className="underline cursor-pointer" onClick={() => resendOtp()}>resendCode</span>
							</span>
						</div>
						<PulsatingButton
							onClick={(e)=>handleOtp(e)}
							className={`max-md:text-base max-sm:text-sm text-lg font-medium p-3 w-[80%] my-2 rounded-full flex justify-center items-center ${isProcessing ? "cursor-wait" : "cursor-pointer"}`}
						>
							Submit
						</PulsatingButton>
					</div>
				) : (
					<div className="max-md:mx-1  mt-10 glass-bg p-5 delay-5ms flex gap-1  w-[600px]  flex-col items-center justify-between overflow-hidden rounded-2xl shadow-2xl ">
						<div className="w-full">
							<span className="text-2xl font-semibold text-stone-800">
								Upload Files
							</span>
						</div>
						{/* showfiles if selected else show drag drop cont */}
						{files.length > 0 ? (
							<>
								{" "}
								<div className="w-full max-h-[200px] rounded-[8px] overflow-auto overflow-x-hidden flex flex-col justify-start items-center bg-transparent mt-2 gap-1">
									{files.map((file, index) => (
										<div
											// biome-ignore lint/suspicious/noArrayIndexKey: <>
											key={index}
											className="hover:bg-[#f5f5f57e]  bg-[#f5f5f52d] w-full list-card cursor-pointer flex flex-col  justify-center items-center rounded-[8px] px-2 py-1"
										>
											<span className=" text-lg font-medium capitalize w-full text-stone-800">
												{file.name}
											</span>
											<div className=" flex w-full justify-between items-center">
												<div className="flex justify-start items-center gap-3">
													<span className=" text-sm font-normal text-zinc-700">
														{formatFileSize(file.size)}
													</span>
													<span className=" text-xs font-normal text-zinc-700">
														|
													</span>
													<span className=" text-sm font-normal text-zinc-700">
														{file.type}
													</span>
												</div>
												<div className="flex justify-center items-center ">
													{/* biome-ignore lint/a11y/useKeyWithClickEvents: <> */}
													<span
														onClick={() => removeSelectedFile(index)}
														className="list-btn-title-cont delay-5ms hover:bg-[#32323218] text-stone-800 p-1 rounded-full flex justify-center items-center"
													>
														<IoClose className="size-5" />
														<span className="list-btn-title">Delete</span>
													</span>
												</div>
											</div>
										</div>
									))}
								</div>
								<div className="cursor-pointer w-full flex justify-between items-center p-2 px-3 rounded-[8px] bg-[#93beff25] hover:bg-[#93beff41]">
									<span className="text-base text-blue-700 font-medium">
										{files.length} Files
									</span>
									<input
									onKeyDown={(e) => {
										if (e.key === "Enter") {
										  handleUpload(e);
										}
									  }}
										id="add-more"
										type="file"
										multiple
										className="hidden"
										onChange={(e) => mergeFiles(e.target.files)}
									/>
									<label
										htmlFor="add-more"
										className="flex gap-2 justify-center items-center text-base text-blue-700 font-medium"
									>
										Add more
										<span className="list-btn-title-cont delay-5ms hover:bg-blue-700 text-blue-200 bg-blue-600 p-1 rounded-full flex justify-center items-center">
											<IoMdAdd className="size-5" />

											<span className="list-btn-title">Add_more</span>
										</span>
									</label>
								</div>
							</>
						) : (
							<div
								{...getRootProps()}
								className="cursor-pointer flex flex-col gap-2 justify-center items-center  border-[3px] border-zinc-400 border-dashed w-full h-[200px] rounded-xl mt-1"
							>
								<SlCloudUpload className="size-20 text-stone-800" />
								{isDragActive ? (
									<span className="text-xl text-center font-medium cursor-default">
										Drop files here
									</span>
								) : (
									<span className="text-center text-xl font-medium cursor-default">
										Drag & drop files or{" "}
										<span className="cursor-pointer underline hover:no-underline">
											{" "}
											<input {...getInputProps()} /> Browse
										</span>
									</span>
								)}
							</div>
						)}
						<div className="flex justify-between items-center w-full text-[12px] text-zinc-600 ">
							<span>Supported formts: All formats</span>
							<span>Max size: {user?.transferLimit || "2 GB"}</span>
						</div>
						<div className="w-full flex justify-start items-center gap-3 my-3">
							<label className="flex gap-1 justify-center items-center text-stone-800 text-[15px] font-medium">
								<input
								onKeyDown={(e) => {
									if (e.key === "Enter") {
									  handleUpload(e);
									}
								  }}
									type="radio"
									checked={isSentToEmail}
									onClick={() => setIsSentToEmail(true)}
									className="size-4"
								/>
								Send Email
							</label>
							<label className="flex gap-1 justify-center items-center text-stone-800 text-[15px] font-medium">
								<input
								onKeyDown={(e) => {
									if (e.key === "Enter") {
									  handleUpload(e);
									}
								  }}
									type="radio"
									checked={!isSentToEmail}
									onClick={() => setIsSentToEmail(false)}
									className="size-4"
								/>
								Create Link
							</label>
						</div>
						<div className="w-full bg-transparent flex flex-col gap-2">
							{isSentToEmail && (
								<div className="upload-input text-stone-800 text-lg font-normal flex gap-1 flex-wrap outline-none p-3  w-full rounded-xl">
									{senderEmails.map((mail, index) => (
										<span
											// biome-ignore lint/suspicious/noArrayIndexKey: <>
											key={index}
											className="hover:bg-white hover:border-zinc-300 cursor-pointer border shadow-sm rounded-xl w-max px-2 text-sm text-zinc-500 flex justify-center items-center gap-1"
										>
											{mail}{" "}
											<IoClose
												onClick={() => removeSenderMails(index)}
												className=" size-4 rounded-full"
											/>
										</span>
									))}
									<input
									
										type="email"
										value={emailTo}
										onChange={(e) => setEmailTo(e.target.value)}
										onKeyDown={addEmailsToSenderList}
										placeholder="Email to"
										className=" placeholder:text-zinc-500 bg-transparent text-stone-800 text-lg font-normal outline-none  w-full "
									/>
								</div>
							)}
							{!token && (
								<input
								onKeyDown={(e) => {
									if (e.key === "Enter") {
									  handleUpload(e);
									}
								  }}
									type="email"
									placeholder="Your Email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className=" placeholder:text-zinc-500 upload-input text-stone-800 text-lg font-normal outline-none p-3  w-full rounded-xl"
								/>
							)}
							<input
							onKeyDown={(e) => {
								if (e.key === "Enter") {
								  handleUpload(e);
								}
							  }}
								type="text"
								placeholder="Subject"
								value={subject}
								onChange={(e) => setSubject(e.target.value)}
								className=" placeholder:text-zinc-500 upload-input text-stone-800 text-lg font-normal outline-none p-3  w-full rounded-xl"
							/>
							<textarea
							onKeyDown={(e) => {
								if (e.key === "Enter") {
								  handleUpload(e);
								}
							  }}
								placeholder="Message"
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								className="resize-none placeholder:text-zinc-500 upload-input text-stone-800 text-lg font-normal outline-none p-3  w-full rounded-xl"
							/>
							<PulsatingButton
								onClick={(e)=>handleUpload(e)}
								className={`max-md:text-base max-sm:text-sm text-lg font-medium p-4 my-2 rounded-full flex justify-center items-center ${isProcessing ? "cursor-wait" : "cursor-pointer"}`}
							>
								Transfer File
							</PulsatingButton>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};





export default UploadHero;
