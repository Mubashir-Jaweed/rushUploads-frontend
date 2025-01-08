import { Suspense } from "react";

import { SuspendedPage } from "./suspended-page";

const page = () => {
	return (
		<Suspense>
			<SuspendedPage />
		</Suspense>
	);
};

export default page;
