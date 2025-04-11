export function LoadingSpinner() {
	return (
		<div className="flex items-center justify-center">
			<div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full">
				<span className="sr-only">Loading...</span>
			</div>
		</div>
	);
}
