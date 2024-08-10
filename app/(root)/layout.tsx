import MobileNav from "@/components/MobileNav";
import SideBar from "@/components/SideBar";
import Image from 'next/image';

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const loggedIn = { firstName: 'Adrian', lastName: 'JSM' }
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
