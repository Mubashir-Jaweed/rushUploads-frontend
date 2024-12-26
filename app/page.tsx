import About from "@/components/About";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Teams from "@/components/Teams";

export default function Home() {
	return (
		<div className="bg-zinc-100">
			<Navbar />
			<Hero />
			{/* <Teams/> */}
			{/* <About/> */}
		</div>
	);
}
