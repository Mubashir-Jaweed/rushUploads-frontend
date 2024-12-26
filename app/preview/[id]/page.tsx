"use client";

import { useParams } from "next/navigation";

const page = () => {
	const { id } = useParams();
	return <div>preview{id}</div>;
};

export default page;
