"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface BlurIntProps {
	className?: string;
	variant?: {
		hidden: { filter: string; opacity: number };
		visible: { filter: string; opacity: number };
	};
	duration?: number;
	children: React.ReactNode;
}
const BlurIn = ({
	children,
	className,
	variant,
	duration = 1,
}: BlurIntProps) => {
	const defaultVariants = {
		hidden: { filter: "blur(10px)", opacity: 0 },
		visible: { filter: "blur(0px)", opacity: 1 },
	};
	const combinedVariants = variant || defaultVariants;

	return (
		<motion.h1
			initial="hidden"
			animate="visible"
			transition={{ duration }}
			variants={combinedVariants}
			className={cn("font-display text-center  drop-shadow-sm ", className)}
		>
			{children}
		</motion.h1>
	);
};

export default BlurIn;
