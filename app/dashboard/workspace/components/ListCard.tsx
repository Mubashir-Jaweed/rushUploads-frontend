import axios from "axios";
import React from "react";
import { IoIosLink } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { LuDownload } from "react-icons/lu";
import { toast } from "react-toastify";

interface CardDataProps {
	data: {
		id: string;
		name: string;
		updatedAt: string;
		link: string;
		date: string;
		isExpired: boolean;
	};
	status: string;
	deleteFile: () => void;

	[key: string]: unknown;
}
const ListCard = ({ data, status, deleteFile }: CardDataProps) => {
	const handleDownload = (url, name) => {
		// Split the URL into parts
		const splitUrl = url.split("/");

		// Insert the custom part into the URL
		splitUrl.splice(6, 0, `fl_attachment:${name}_rush_upload`);

		// Recombine the parts into a new URL
		const updatedUrl = splitUrl.join("/");

		// Create an anchor element
		const anchor = document.createElement("a");
		anchor.href = updatedUrl; // Set the updated URL as the href
		anchor.download = name; // Set the filename for the download
		document.body.appendChild(anchor); // Append the anchor to the body
		anchor.click(); // Trigger a click event to start download
		// document.body.removeChild(anchor); // Remove the anchor after use
	};

	const copyUrl = (url: string) => {
		navigator.clipboard.writeText(url);
		toast('Url Copied')
		console.log(url);
	};

	return (
		<div className="hover:bg-[#f5f5f57e] bg-[#f5f5f52d] w-full list-card cursor-pointer flex flex-col  justify-center items-center rounded-[8px] p-3">
			<span className="text-lg font-medium  w-full text-stone-800">
				{data.originalName}
			</span>
			<div className="flex w-full justify-between items-end">
				<div className="flex justify-start items-center gap-3">
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
				<div className="flex justify-center items-center ">
					<a
						download={true}
						href={data.url}
						className="list-btn-title-cont delay-5ms hover:bg-[#32323218] text-stone-800 p-2 rounded-full flex justify-center items-center"
					>
						<LuDownload className="size-5" />
						<span className="list-btn-title">Download</span>
					</a>
					<span
						onClick={() => copyUrl(data.url)}
						className="list-btn-title-cont  delay-5ms hover:bg-[#32323218] text-stone-800 p-2 rounded-full flex justify-center items-center"
					>
						<IoIosLink className="size-5" />
						<span className="list-btn-title">Copy_Link</span>
					</span>
					<span
						onClick={deleteFile}
						className="list-btn-title-cont delay-5ms hover:bg-[#32323218] text-stone-800 p-2 rounded-full flex justify-center items-center"
					>
						<IoClose className="size-5" />
						<span className="list-btn-title">Delete</span>
					</span>
				</div>
			</div>
		</div>
	);
};

export default ListCard;
