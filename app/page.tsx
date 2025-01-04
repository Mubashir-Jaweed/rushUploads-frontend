import About from "@/components/About";
import Faq from "@/components/Faq";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Testimonials from "@/components/Testimonials";
import TryIt from "@/components/TryIt";

export default function Home() {
	return (
		<div className="bg-zinc-100">
			<Navbar />
			<Hero />
			<About/>
			<Testimonials/>
			<Faq/>
			<TryIt/>
		</div>
	);
}
