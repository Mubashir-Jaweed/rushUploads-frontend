'use client'
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import AnimatedGradientText from "@/components/ui/animated-gradient-text";
import BlurIn from "@/components/ui/blur-in";
import GridPattern from "@/components/ui/grid-pattern";
import PulsatingButton from "@/components/ui/pulsating-button";
import { cn } from "@/lib/utils";
import AdUnit from "./ads/adUnit";

const Hero = () => {
	return (
		<div className="scroll-smooth h-screen w-full p-3">

			<AdUnit/>
			<GridPattern
				width={40}
				height={40}
				x={-1}
				y={-1}
				className={cn(
					"[mask-image:linear-gradient(to_bottom_top,white,transparent,transparent)] ",
				)}
			/>
			<div className="max-md:gap-3  h-[100%] w-[100%] hero-bg rounded-xl flex flex-col justify-center items-center gap-7">
				<button onClick={() => {
					const aboutSection = document.getElementById("feature");
					aboutSection?.scrollIntoView({ behavior: "smooth" });
				}}>
					<AnimatedGradientText >
						<span
							className={cn(
								"max-md:text-base max-sm:text-sm inline text-lg animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent",
							)}
						>
							Introducing Rush-Uploads
						</span>
						<ChevronRight className="ml-1 size-5 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
					</AnimatedGradientText>
				</button>

				<BlurIn
					duration={0.9}
					className="max-md:text-4xl max-sm:text-2xl max-sm:leading-[30px] max-sm:font-bold max-md:w-[70%] md:w-[80%] max-sm:w-[80%] text-6xl font-semibold text-center text-stone-800 leading-[65px] w-[50%]"
				>
					Empower Seamless Uploads and Effortless Organization
					with Ease Dashboard
				</BlurIn>

				<BlurIn
					duration={1}
					className="text-center w-[60%] text-zinc-800 text-lg max-sm:w-[90%] max-md:text-base max-sm:text-sm"
				>
					Streamline your file-sharing experience with our secure platform.
					Upload, organize, and access files effortlessly, while enjoying
					advanced features like previews, fast uploads, and top-notch security
					to keep your data safe and always within reach.
				</BlurIn>

				<BlurIn duration={1.2}>
					<Link href={"/upload"}>
						<PulsatingButton className="max-md:text-base max-sm:text-sm text-lg font-medium px-10 py-3 rounded-full flex justify-center items-center">
							Upload Files
						</PulsatingButton>
					</Link>
				</BlurIn>
			</div>
		</div>
	);
};

export default Hero;
