export function Toast({
	message,
	type = "success",
}: {
	message: string;
	type?: "success" | "error";
}) {
	return (
		<div
			className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
				type === "success" ? "bg-green-500" : "bg-red-500"
			} text-white`}>
			{message}
		</div>
	);
}
