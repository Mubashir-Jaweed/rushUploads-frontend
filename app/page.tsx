import About from "@/components/About";
import Faq from "@/components/Faq";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import TryIt from "@/components/TryIt";

export default function Home() {
	return (
		<div className="">
			<Navbar />
			<Hero />
			<About/>
			<Testimonials/>
			<Pricing/>
			<Faq/>
			<TryIt/>
		</div>
	);
}
