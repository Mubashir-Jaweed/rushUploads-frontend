'use client'
import About from "@/components/About";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import TryIt from "@/components/TryIt";
import { useEffect, useState } from "react";
import { RxDoubleArrowUp } from "react-icons/rx";


export default function Home() {

const [isScroll, setIsScroll] = useState(false);



	const onScroll = () => {
		if (window.scrollY > 300) {
		  setIsScroll(true);
		} else {
		 
			setIsScroll(false);
		
		}
	  };
	
	  useEffect(() => {
		window.addEventListener("scroll", onScroll);
	  }, []);

	return (
		<div className="scroll-smooth ">
			<Navbar />
			<span id="top">
			<Hero />
			</span>
			<span id="feature">
			<About />
			</span>
			<Testimonials/>
			<Pricing/>
			<Faq/>
			<TryIt/>
			<Footer/>



			 <button
			onClick={() => {
				const aboutSection = document.getElementById("top");
				aboutSection?.scrollIntoView({ behavior: "smooth" });
			}}  
			className={`scroll-btn fixed z-10 bottom-10 border-[1.5px] bg-white border-[#ff4262] py-3 rounded-3xl px-[0.5px] left-[95%] delay-5ms ${isScroll ? 'bottom-10' : 'bottom-[-100px]'}`}>
				<RxDoubleArrowUp className="size-8 text-[#ff4262]"/>
			</button>



		</div>
	);
}
