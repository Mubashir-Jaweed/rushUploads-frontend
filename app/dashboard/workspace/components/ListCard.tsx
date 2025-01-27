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



	const copyUrl = (url: string) => {
		navigator.clipboard.writeText(url);
		toast('Url Copied')
		console.log(url);
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
				// Executable files
				'exe', 'msi', 'bat', 'sh', 'dmg', 'apk', 'deb', 'rpm', 'bin', 'pkg', 'appimage', 'command',
			
				// Compressed & Archive files
				'zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz', 'tgz', 'z', 'cab', 'arj', 'lzh', 'iso',
			
				// Disk image files
				'iso', 'img', 'vhd', 'vmdk', 'dmg', 'cue', 'bin', 'nrg',
			
				// Document files
				'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'csv', 'txt', 'rtf', 'odt', 'ods', 'odp', 'pages', 'key', 'numbers', 'tex',
			
				// Media files (Videos)
				'mp4', 'mkv', 'avi', 'mov', 'flv', 'wmv', 'webm', 'mpeg', 'mpg', '3gp', 'm4v', 'ts', 'rm', 'rmvb', 'asf', 'divx', 'f4v', 'vob', 'ogv',
			
				// Media files (Audio)
				'mp3', 'wav', 'ogg', 'aac', 'm4a', 'flac', 'wma', 'alac', 'opus', 'aiff', 'amr', 'mka',
			
				// Subtitle files
				'srt', 'sub', 'vtt', 'ssa', 'ass', 'stl',
			
				// Image files
				'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'svg', 'webp', 'ico', 'heic', 'heif', 'raw', 'psd', 'ai', 'xcf',
			
				// Font files
				'ttf', 'otf', 'woff', 'woff2', 'eot', 'pfa', 'pfb', 'fnt', 'afm',
			
				// System and library files
				'dll', 'sys', 'lib', 'so', 'ko', 'inf', 'ini', 'cfg', 'log', 'properties',
			
				// Programming and script files
				'js', 'ts', 'rb', 'py', 'pl', 'php', 'html', 'css', 'java', 'c', 'cpp', 'cs', 'swift', 'go', 'lua', 'dart', 'sh', 'xml', 'json', 'yml', 'yaml', 'md', 'log', 'sql',
			
				// E-books and documents
				'epub', 'mobi', 'azw', 'azw3', 'fb2', 'lit', 'djvu', 'ibooks', 'oxps',
			
				// Vector and CAD files
				'svg', 'eps', 'dxf', 'dwg', 'ai', 'ps', 'cdr', 'fig',
			
				// Video project files
				'prproj', 'veg', 'proj', 'aep', 'imovieproj', 'fcpxml',
			
				// 3D modeling files
				'blend', '3ds', 'obj', 'fbx', 'stl', 'dae', 'gltf', 'ply', 'amf',
			
				// Design and editing files
				'psd', 'ai', 'sketch', 'fig', 'xcf', 'xd', 'indd', 'qxd',
			
				// Backup files
				'bak', 'tmp', 'old', 'swp', 'bkp', 'sav', 'gho', 'vmdk',
			
				// Miscellaneous file formats
				'crx', 'xpi', 'jar', 'war', 'apk', 'ipa', 'vsix', 'cab', 'ttx', 'idml', 'pub',
			
				// Other data files
				'db', 'sqlite', 'sql', 'accdb', 'mdb', 'nsf', 'log', 'dat', 'cfg', 'tmp', 'dmp', 'dtd',
			
				// Other package files
				'crx', 'tar.gz', 'bz2', 'xz', 'tgz', 'lz', 'appx', 'snap', 'flatpak',
			
				// Logs, configs, and misc text
				'conf', 'log', 'cfg', 'env', 'ini', 'reg', 'lst', 'out', 'properties', 'bat', 'sh'
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
						onClick={() => copyUrl(data.url)}
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
