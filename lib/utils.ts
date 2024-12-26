import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const formatFileSize = (sizeInBytes: number) => {
	if (sizeInBytes === -1) {
		return "Unlimited";
	}

	const format = (size: number, unit: string) => {
		return `${Number.parseFloat(size.toFixed(2))} ${unit}`;
	};

	if (sizeInBytes < 1024) {
		return `${sizeInBytes} Bytes`;
	}

	if (sizeInBytes < 1024 * 1024) {
		return format(sizeInBytes / 1024, "KB");
	}

	if (sizeInBytes < 1024 * 1024 * 1024) {
		return format(sizeInBytes / (1024 * 1024), "MB");
	}

	if (sizeInBytes < 1024 * 1024 * 1024 * 1024) {
		return format(sizeInBytes / (1024 * 1024 * 1024), "GB");
	}

	return format(sizeInBytes / (1024 * 1024 * 1024 * 1024), "TB");
};
