"use client";

import { useEffect, type PropsWithChildren } from "react";

import { useRouter } from "next/navigation";

import { useUserContext } from "@/contexts/user";

export default function ProtectedLayout({
	children,
}: Readonly<PropsWithChildren>) {
	const router = useRouter();

	const { isLoading, token } = useUserContext();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <>
	useEffect(() => {
		if (!isLoading && !token) {
			return router.push("/login");
		}
	}, [isLoading]);

	if (isLoading || !token) {
		return null;
	}

	return <>{children}</>;
}
