"use client";

import { useEffect, type PropsWithChildren } from "react";

import { useRouter } from "next/navigation";

import { useUserContext } from "@/contexts/user";

export default function ProtectedLayout({
    children,
}: Readonly<PropsWithChildren>) {
    const router = useRouter();

    const { isLoading, token } = useUserContext();

    useEffect(() => {
        const localToken = localStorage.getItem("token");

        if (!isLoading && !token && !localToken) {
            return router.push("/login");
        }
    }, [router.push, isLoading, token]);

    if (isLoading || !token) {
        return null;
    }

    return <>{children}</>;
}
