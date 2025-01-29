import React from "react";
import { MdOutlineCloudUpload } from "react-icons/md";
import { LuMilestone } from "react-icons/lu";
import { HiOutlineCurrencyDollar } from "react-icons/hi2";
import { FadeText } from "@/components/ui/fade-text";
import BlurIn from "@/components/ui/blur-in";
import Link from "next/link";
import PulsatingButton from "@/components/ui/pulsating-button";

const HowItWorks = () => {
    return (
        <div className="py-36 min-h-[100vh] w-full flex justify-center items-center">
            <div className="w-[80%]  flex flex-col justify-center items-center gap-3" >
                <span className="text-center">

                    <FadeText
                        direction="up"
                        framerProps={{
                            show: { transition: { delay: 0.5 } },
                        }}
                        className="max-md:text-4xl max-sm:text-2xl max-sm:leading-[30px] max-sm:font-bold max-md:w-[70%] md:w-[80%] max-sm:w-[80%] text-6xl font-semibold  text-stone-800 leading-[65px]"
                    >
                        Earn with Our Affiliate Program
                    </FadeText>
                </span>

                <span className="text-center">
                    <FadeText
                        direction="up"
                        framerProps={{
                            show: { transition: { delay: 0.5 } },
                        }}
                        className="text-center w-[60%] text-zinc-700 text-lg max-sm:w-[90%] max-md:text-base max-sm:text-sm"
                    >
                        Welcome to the Rush Uploads Affiliate Program! Here’s your chance to turn your file-sharing into a rewarding experience. With every file you upload, you open the door to earning rewards.

                    </FadeText>
                </span>
                <div className="w-full flex justify-center items-center gap-10 flex-wrap mt-10" >
                    {data.map((val, i) => (
                        <div key={i} className=" flex justify-center items-start flex-col gap-3 w-[350px] max-sm:shadow-md rounded-2xl max-sm:p-3">
                            <span className="p-3 rounded-full bg-[#ff90a337]">
                                {val.icon}
                            </span>
                            <span className="text-xl font-semibold max-md:text-base ">
                                {val.head}
                            </span>
                            <span className="text-base text-slate-500 max-md:text-base max-sm:text-sm">
                                {val.text}
                            </span>
                        </div>
                    ))}
                </div>
                <BlurIn duration={1.2}>
					<Link href={"/upload"}>
						<PulsatingButton className="max-md:text-base max-sm:text-sm text-lg font-medium px-10 py-3 mt-16 rounded-full flex justify-center items-center">
							Upload Files
						</PulsatingButton>
					</Link>
				</BlurIn>
            </div>
        </div>
    );
};




const data = [
    {
        head: "Upload Your Files",
        text: 'Share your files effortlessly with your audience. Each file you upload comes with a unique download link.',
        icon: <MdOutlineCloudUpload className="size-6 text-[#ff4262] " />

    },
    {
        head: "Reach Milestones",
        text: 'When your uploaded file hits 1,000 downloads, you automatically qualify for a $7 reward.',
        icon: <LuMilestone className="size-6 text-[#ff4262] " />

    },
    {
        head: "Get Rewarded",
        text: 'Our system tracks your downloads in real-time. Once you hit the target, your earnings are credited seamlessly to your account.',
        icon: <HiOutlineCurrencyDollar className="size-6 text-[#ff4262] " />

    },
]

export default HowItWorks;
