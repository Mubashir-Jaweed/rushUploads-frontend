import AnimatedGradientText from "@/components/ui/animated-gradient-text";
import BlurIn from "@/components/ui/blur-in";
import GridPattern from "@/components/ui/grid-pattern";
import PulsatingButton from "@/components/ui/pulsating-button";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from 'react'

const Hero = () => {
  return (
    <div className="bg-white h-screen w-full p-3" >
      <GridPattern
        width={40}
        height={40}
        x={-1}
        y={-1}
        className={cn(
          "[mask-image:linear-gradient(to_bottom_top,white,transparent,transparent)] ",
        )}
      />
      <div className="h-[100%] w-[100%] hero-bg rounded-xl flex flex-col justify-center items-center gap-7">


        <AnimatedGradientText>

          <span
            className={cn(
              `inline text-lg animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
            )}
          >
            Introducing Rush-Uploads
          </span>
          <ChevronRight className="ml-1 size-5 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
        </AnimatedGradientText>

        <BlurIn
          duration={0.9}
          className="text-6xl font-semibold text-center text-stone-800 leading-[65px]"
        >
          Empower Seamless <br /> Uploads and Effortless Organization <br />with Ease Dashboard
        </BlurIn>

        <BlurIn duration={1}
          className="text-center w-[60%] text-zinc-700 text-lg" >
          Streamline your file-sharing experience with our secure platform. Upload, organize,
          and access files effortlessly,
          while enjoying advanced features like previews,
          fast uploads, and top-notch security to keep your data
          safe and always within reach.
        </BlurIn>

        {/* <button className="bg-white rounded-full px-7 py-3 text-lg font-medium">Get Started</button> */}
        <BlurIn duration={1.2}>
          <Link href={'/upload'}>
            <PulsatingButton className="text-lg font-medium px-10 py-3 rounded-full flex justify-center items-center">Upload Files
            </PulsatingButton></Link>
        </BlurIn>



      </div>
    </div>
  )
}

export default Hero
