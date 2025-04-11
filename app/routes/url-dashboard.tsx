import { Form, Link, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { URLInfo } from "~/lib/interface";
import { deleteAllUrls, deleteOneUrl, getAllUrls } from "~/utils/dbUtils";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";

export async function loader() {
	const urls = await getAllUrls();
	// console.log(urls);

	return new Response(JSON.stringify(urls), {
		headers: { "Content-Type": "application/json" },
	});
}

export async function action({ request }: { request: Request }) {
	const formData = await request.formData();
	const shortId = formData.get("shortId") as string;
	const deleteAll = formData.get("deleteAll") as string;

	if (deleteAll === "true") {
		return await deleteAllUrls();
	}

	const resp = await deleteOneUrl(shortId);
	return { resp };
}

const Dashboard = () => {
	const loaderData = useLoaderData<URLInfo[]>();

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-200 to-slate-400 p-6">
			<Card className="max-w-6xl mx-auto bg-white/90 backdrop-blur shadow-xl">
				<CardHeader className="text-center border-b pb-6">
					<CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
						URL Dashboard
					</CardTitle>
					<CardDescription className="text-lg mt-2">
						Manage your shortened URLs
					</CardDescription>
				</CardHeader>

				{loaderData ? (
					<>
						{loaderData.length > 0 ? (
							<div className="p-6">
								<div className="rounded-lg border shadow-sm overflow-hidden">
									<Table>
										<TableHeader>
											<TableRow className="bg-slate-50">
												<TableHead className="w-[80px] font-semibold">
													No.
												</TableHead>
												<TableHead className="font-semibold">
													Short ID
												</TableHead>
												<TableHead className="font-semibold">
													Original URL
												</TableHead>
												<TableHead className="text-right font-semibold">
													Clicks
												</TableHead>
												<TableHead className="w-[100px] text-center font-semibold">
													Actions
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{loaderData?.map((data, index) => (
												<TableRow
													key={data._id}
													className="hover:bg-slate-50/50 transition-colors">
													<TableCell className="font-medium">
														{index + 1}
													</TableCell>
													<TableCell>
														<Link
															to={`/info/${data.shortId}`}
															className="text-primary hover:underline font-medium">
															{data.shortId}
														</Link>
													</TableCell>
													<TableCell
														className="truncate max-w-[300px]"
														title={data.redirectURL}>
														{data.redirectURL}
													</TableCell>
													<TableCell className="text-right font-medium">
														{data.visitHistory.length}
													</TableCell>
													<TableCell>
														<AlertDialog>
															<AlertDialogTrigger asChild>
																<Button
																	variant="destructive"
																	size="sm"
																	className="w-full">
																	Delete
																</Button>
															</AlertDialogTrigger>
															<AlertDialogContent className="sm:max-w-[425px]">
																<AlertDialogHeader>
																	<AlertDialogTitle className="text-red-600">
																		Delete URL
																	</AlertDialogTitle>
																	<AlertDialogDescription className="text-slate-600">
																		This will permanently delete this shortened
																		URL. This action cannot be undone.
																	</AlertDialogDescription>
																</AlertDialogHeader>
																<AlertDialogFooter className="gap-2">
																	<AlertDialogCancel className="mt-0">
																		Cancel
																	</AlertDialogCancel>
																	<Form method="post">
																		<input
																			type="text"
																			name="shortId"
																			value={data.shortId}
																			hidden
																			readOnly
																		/>
																		<Button type="submit" variant="destructive">
																			Delete
																		</Button>
																	</Form>
																</AlertDialogFooter>
															</AlertDialogContent>
														</AlertDialog>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>

								<div className="mt-6 flex justify-end">
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<Button variant="destructive" className="px-6">
												Delete All URLs
											</Button>
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle className="text-red-600">
													Delete All URLs
												</AlertDialogTitle>
												<AlertDialogDescription className="text-slate-600">
													This will permanently delete all your shortened URLs.
													This action cannot be undone.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter className="gap-2">
												<AlertDialogCancel className="mt-0">
													Cancel
												</AlertDialogCancel>
												<Form method="post">
													<input
														type="text"
														name="deleteAll"
														value="true"
														hidden
														readOnly
													/>
													<Button type="submit" variant="destructive">
														Delete All
													</Button>
												</Form>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</div>
							</div>
						) : (
							<div className="p-12 text-center text-slate-600">
								<p className="text-lg">No URLs found</p>
								<Link
									to="/"
									className="text-primary hover:underline mt-2 inline-block">
									Create your first shortened URL
								</Link>
							</div>
						)}
					</>
				) : (
					<div className="p-12 text-center">
						<div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
						<p className="text-slate-600 mt-4">Loading...</p>
					</div>
				)}
			</Card>
		</div>
	);
};
export default Dashboard;
