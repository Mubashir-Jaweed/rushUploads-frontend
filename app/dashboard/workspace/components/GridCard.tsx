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

	const copyUrl = (url: string) => {
			navigator.clipboard.writeText(url);
			toast('Url Copied')
			console.log(url);
		};


			async function downloadFile(url: string, filename: string) {
				try {
					const splitName = filename.split('.');
					const extension = splitName[splitName.length - 1]?.toLowerCase();
		
					const directDownloadExtensions = [
						'msi', 'exe', 'dmg', 'apk', 'deb', 'rpm', 'bat', 'sh',
						'zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz',
						'yaml', 'yml', 'xml', 'ini', 'log', 'conf',
						'sqlite', 'db', 'sql', 'mdb', 'accdb',
						'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'csv',
						'mp4', 'mkv', 'avi', 'mov', 'flv', 'wmv', 'mp3', 'wav', 'ogg',
						'ttf', 'otf', 'woff', 'woff2', 'eot',
						'iso', 'bin', 'img', 'dll', 'sys', 'lib',
						'js', 'ts', 'py', 'rb', 'pl', 'php', 'html', 'css', 'apk', 'crx', 'pkg', 'appimage'
					];
		
					if (directDownloadExtensions.includes(extension)) {
						const link = document.createElement('a');
						link.href = url;
						link.download = filename || 'downloaded-file';
						document.body.appendChild(link);
						link.click();
						document.body.removeChild(link);
					} else {
						const response = await fetch(url);
		
						if (!response.ok) {
							throw new Error(`HTTP error! Status: ${response.status}`);
						}
						const blob = await response.blob();
		
						const blobUrl = URL.createObjectURL(blob);
		
						const a = document.createElement('a');
						a.href = blobUrl;
						a.download = splitName[0] + '-rush-upload' || 'downloaded-file';
						document.body.appendChild(a);
						a.click();
						document.body.removeChild(a);
		
						URL.revokeObjectURL(blobUrl);
					}
				} catch (error) {
					console.error('Error downloading file:', error);
					toast.error('Error in downloading file');
				}
			}
		
	
	return (
		<div className="relative w-[300px]  list-card cursor-pointer hover:bg-[#f5f5f57e] bg-[#f5f5f52d] flex flex-col gap-1 justify-between items-start rounded-[8px]">
			<span className="text-lg font-medium capitalize  text-stone-800 pt-3 pl-3">
				{data.originalName}
			</span>
			<div className="flex w-full justify-between items-end p-[3px]">
				<div className="flex justify-start items-center gap-2 p-2">
					<span className=" text-sm font-normal text-zinc-700">
						{status} {data.updatedAt.split("T")[0]}
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
						onClick={() => copyUrl(data.url)}
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
