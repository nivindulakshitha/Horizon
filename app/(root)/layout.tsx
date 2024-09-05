import MobileNav from "@/components/MobileNav";
import SideBar from "@/components/SideBar";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import Image from 'next/image';
import { redirect } from "next/navigation";

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const loggedIn = await getLoggedInUser();

	if (!loggedIn) {
		redirect("/sign-in");
	}

	return (
		<main className="flex h-screen w-full font-inter">
			<SideBar user={loggedIn} />
			<div className="flex size-full flex-col">
				<div className="root-layout">
					<Image
						src="/icons/logo.svg"
						alt="Menu icon"
						width={30}
						height={30}
					/>
					<MobileNav user={loggedIn} />
				</div>
				{children}
			</div>
		</main>
	);
}
