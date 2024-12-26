"use client";

import type { PropsWithChildren, Dispatch, SetStateAction } from "react";

import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

import { formatFileSize } from "@/lib/utils";

export type Role = "USER" | "ADMIN";

export type Tier = "FREE" | "PRO" | "PREMIUM";

export interface User {
	id: string;
	email: string;
	role: Role;
	tier: Tier;
	totalStorage: string;
	usedStorage: string;
	transferLimit: string;
	isVerified: boolean;
	updatedAt: Date;
}

export const UserContext = createContext<{
	isLoading: boolean;
	token: string | null;
	user: User | null;
	setIsLoading: Dispatch<SetStateAction<boolean>> | null;
	setToken: Dispatch<SetStateAction<string | null>> | null;
	setUser: Dispatch<SetStateAction<User | null>> | null;
}>({
	isLoading: false,
	token: null,
	user: null,
	setIsLoading: null,
	setToken: null,
	setUser: null,
});

export const useUserContext = () => {
	return useContext(UserContext);
};

export function UserProvider({ children }: Readonly<PropsWithChildren>) {
	const router = useRouter();

	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);

	useEffect(() => {
		if (token) {
			localStorage.setItem("token", token);
		}

		setIsLoading(false);
	}, [token]);

	useEffect(() => {
		const localToken = localStorage.getItem("token");

		if (localToken) {
			(async () => {
				try {
					const response = await axios.post(
						`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`,
						{},
						{
							headers: {
								authorization: `Bearer ${localToken}`,
							},
						},
					);

					setToken(response.data.data.token);
					setUser({
						id: response.data.data.user.id,
						email: response.data.data.user.email,
						role: response.data.data.user.role,
						tier: response.data.data.user.tier,
						totalStorage: formatFileSize(response.data.data.user.totalStorage),
						usedStorage: formatFileSize(response.data.data.user.usedStorage),
						transferLimit: formatFileSize(
							response.data.data.user.transferLimit || 0,
						),
						isVerified: response.data.data.user.isVerified,
						updatedAt: new Date(response.data.data.user.updatedAt),
					});
				} catch (error) {
					setToken(null);
					setUser(null);

					localStorage.removeItem("token");

					return router.push("/login");
				}
			})();
		}

		setIsLoading(false);
	}, [router.push]);

	return (
		<UserContext.Provider
			value={{
				isLoading,
				token,
				user,
				setIsLoading,
				setToken,
				setUser,
			}}
		>
			{children}
		</UserContext.Provider>
	);
}
