import { useState } from "react";
import { Button } from "./ui/button";

export function CopyButton({ text }: { text: string }) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<Button onClick={handleCopy} variant="outline" size="sm" className="ml-2">
			{copied ? (
				<span className="text-green-600">Copied!</span>
			) : (
				<span>Copy</span>
			)}
		</Button>
	);
}
