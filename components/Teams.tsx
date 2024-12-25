import React from "react";
import Marquee from "./ui/marquee";

const Teams = () => {
	return (
		<div className="w-full py-24 border flex flex-col justify-center items-center gap-5">
			<span className="text-zinc-700 text-lg font-medium uppercase">
				Proven Reliable by Top Teams
			</span>
			<div className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-transparent">
				<Marquee pauseOnHover className="[--duration:20s]"></Marquee>
				<div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-zinc-100"></div>
				<div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-zinc-100"></div>
			</div>
		</div>
	);
};

export default Teams;
