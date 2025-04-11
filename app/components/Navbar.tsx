import { Link } from "@remix-run/react";

export function Navbar() {
	return (
		<nav className="bg-primary text-primary-foreground px-4 py-3 shadow-md">
			<div className="max-w-7xl mx-auto flex justify-between items-center">
				<Link to="/" className="text-xl font-bold hover:opacity-90">
					Shorten It
				</Link>
				<div className="space-x-4">
					<Link to="/" className="hover:opacity-90">
						Home
					</Link>
					<Link to="/url-dashboard" className="hover:opacity-90">
						Dashboard
					</Link>
				</div>
			</div>
		</nav>
	);
}
