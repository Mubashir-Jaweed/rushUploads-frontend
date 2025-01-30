"use client";
import React, { useEffect, useRef, useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { toast } from "react-toastify";

interface CardDataProps {
	data: {
		name: string;
		size: string;
		link: string;
		date: string;
	};
	status: string;
	deleteFile: () => void;
	[key: string]: unknown;
}

const GridCard = ({ data, status, deleteFile }: CardDataProps) => {
	const [menu, setMenu] = useState(false);

	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setMenu(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const copyUrl = (url: string,file:String) => {
			navigator.clipboard.writeText(`https://rushuploads.com/${url}/${file}`);
			toast('Url Copied')
		};

		function formatDownloadNumber(num) {
			if (num < 1000) return num.toString(); // Show as is if less than 1000
			if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'; // Millions
			if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'; // Thousands
			return num.toString();
		  }


				async function downloadFile(url: string, filename: string) {
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
			
		


	
	return (
		<div className="relative w-[300px]  list-card cursor-pointer hover:bg-[#f5f5f57e] bg-[#f5f5f52d] flex flex-col gap-1 justify-between items-start rounded-[8px]">
			<span className="text-lg font-medium capitalize min-h-[100px] max-h-[150px] text-wrap  text-stone-800 pt-3 pl-3">
				{data.originalName}
			</span>
			<div className="flex w-full justify-between items-end p-[3px]">
				<div className="flex justify-start items-center gap-2 p-2">
				<span className=" max-sm:text-sm text-sm font-medium text-zinc-800">
						Total downloads : {formatDownloadNumber(data.downloads)}
					</span>
					{data.isExpired && (
						<>
							{" "}
							<span className=" text-xs font-normal text-zinc-700">|</span>
							<span className=" text-sm font-normal text-zinc-700">
								Expired
							</span>
						</>
					)}
				</div>
				<span
					onClick={() => setMenu(!menu)}
					onBlur={() => setMenu(false)}
					className="delay-5ms hover:bg-[#32323218] text-stone-800 p-2 rounded-full flex justify-center items-center"
				>
					<HiDotsVertical className="size-5" />
				</span>
			</div>
			{menu && (
				<div
					ref={menuRef}
					className="absolute top-14 right-8 z-10  bg-[#ffffff] w-[115px] rounded-[8px] p-1 "
				>
					<span onClick={() => downloadFile(data.url, data.originalName)} className=" hover:bg-[#a1a1a14d] p-1 rounded-[8px] w-full flex  justify-start items-center">
						Download
					</span>
					{status !== 'received' &&<span
						onClick={deleteFile}
						className=" hover:bg-[#a1a1a14d] p-1 rounded-[8px] w-full flex  justify-start items-center"
					>
						Delete
					</span>}
					<span
						onClick={() => copyUrl('sssdsdsd',data.id)}
						className=" hover:bg-[#a1a1a14d] p-1 rounded-[8px] w-full flex  justify-start items-center"
					>
						Copy_link
					</span>
				</div>
			)}
		</div>
	);
};

export default GridCard;
