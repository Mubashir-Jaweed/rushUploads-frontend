import axios from "axios";
import React from "react";
import { IoIosLink } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { LuDownload } from "react-icons/lu";
import { toast } from "react-toastify";

interface CardDataProps {
	data: {
		id: string;
		originalName: string;
		updatedAt: string;
		url: string;
		date: string;
		isExpired: boolean;
	};
	status: string;
	deleteFile: () => void;

	[key: string]: unknown;
}
const ListCard = ({ data, status, deleteFile }: CardDataProps) => {


console.log(data)
	const copyUrl = (url: string) => {
		navigator.clipboard.writeText(`https://rushuploads.com/${url}`);
		toast('Url Copied')
	};


	// async function downloadFile(url: string, filename: string) {
	// 	const splitName = filename.split('.')

	// 	try {
	// 		// Fetch the file from the S3 URL
	// 		const response = await fetch(url);

	// 		// Check if the fetch was successful
	// 		if (!response.ok) {
	// 			throw new Error(`HTTP error! Status: ${response.status}`);
	// 		}

	// 		// Convert the response to a blob
	// 		const blob = await response.blob();

	// 		// Create a URL for the blob
	// 		const blobUrl = URL.createObjectURL(blob);

	// 		// Create an anchor element and trigger a download
	// 		const a = document.createElement('a');
	// 		a.href = blobUrl;
	// 		a.download = splitName[0]+'-rush-upload'  || 'downloaded-file';
	// 		document.body.appendChild(a);
	// 		a.click();
	// 		document.body.removeChild(a);

	// 		// Revoke the blob URL after the download
	// 		URL.revokeObjectURL(blobUrl);
	// 	} catch (error) {
	// 		toast.error('Error in downloading file')
	// 	}
	// }


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
				'js', 'ts', 'rb', 'pl', 'php', 'html', 'css', 'apk', 'crx', 'pkg', 'appimage'
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
		<div className="hover:bg-[#f5f5f57e] bg-[#f5f5f52d] w-full list-card cursor-pointer flex flex-col  justify-center items-center rounded-[8px] p-3">
			<span className="text-lg max-sm:text-base font-medium overflow-hidden w-full text-stone-800">
				{data.originalName}
			</span>
			<div className="flex w-full justify-between items-end">
				<div className="flex justify-start items-center gap-3">
					<span className=" max-sm:text-sm text-sm font-normal text-zinc-700">
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
				<div className="flex justify-center items-center ">
					<span
						onClick={() => downloadFile(data.url, data.originalName)}
						className="list-btn-title-cont delay-5ms hover:bg-[#32323218] text-stone-800 p-2 rounded-full flex justify-center items-center"
					>
						<LuDownload className="size-6 max-sm:size-4" />
						<span className="list-btn-title">Download</span>
					</span>
					<span
						onClick={() => copyUrl(data.id)}
						className="list-btn-title-cont  delay-5ms hover:bg-[#32323218] text-stone-800 p-2 rounded-full flex justify-center items-center"
					>
						<IoIosLink className="size-6 max-sm:size-4" />
						<span className="list-btn-title">Copy_Link</span>
					</span>
					{status !== 'received' && <span
						onClick={deleteFile}
						className="list-btn-title-cont delay-5ms hover:bg-[#32323218] text-stone-800 p-2 rounded-full flex justify-center items-center"
					>
						<IoClose className="size-6 max-sm:size-4" />
						<span className="list-btn-title">Delete</span>
					</span>}
				</div>
			</div>
		</div>
	);
};

export default ListCard;
