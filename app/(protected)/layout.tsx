import { Navbar } from "./_components/navbar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
	return (
		<div className="h-full w-full flex flex-col items-center justify-center gap-y-10 bg-gradient-to-br from-neutral-950 to-neutral-800">
			<Navbar/>
			{children}
		</div>
	)
};


export default ProtectedLayout;