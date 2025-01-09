import { Form, Link, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import {
	AlertDialog,
	AlertDialogAction,
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
	// useEffect(() => {
	// 	// console.log("loader data: ", loaderData?[0]);
	// }, [loaderData]);

	return (
		<div className="flex flex-col justify-center">
			<Card className="sm:w-[785] mx-auto px-3 py-5 md:w-[70vw]">
				<CardHeader className="mx-auto font-bold">
					<CardTitle className="text-3xl">Dashboard</CardTitle>
					<CardDescription>A list of shortened URL.</CardDescription>
				</CardHeader>
				{loaderData ? (
					<>
						{loaderData.length > 0 ? (
							<>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="w-[100px]">SN</TableHead>
											<TableHead>Short ID</TableHead>
											<TableHead>Original URL</TableHead>
											<TableHead className="text-right">
												Number of Clicks
											</TableHead>
											<TableHead>Edit</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{loaderData?.map((data, index) => (
											<TableRow key={data._id}>
												<TableCell className="font-medium">
													{index + 1}
												</TableCell>
												<TableCell className="underline">
													<Link to={`/info/${data.shortId}`}>
														{data.shortId}
													</Link>
												</TableCell>
												<TableCell>{data.redirectURL}</TableCell>
												<TableCell className="text-right">
													{data.visitHistory.length}
												</TableCell>
												<TableCell>
													{/* <Button
											variant={"destructive"}
											onClick={async () => await handleDelete(data.shortId)}>
											Delete
										</Button> */}
													<AlertDialog>
														<AlertDialogTrigger asChild>
															<Button
																variant={"destructive"}
																// onClick={async () => await handleDelete(data.shortId)}
															>
																Delete
															</Button>
														</AlertDialogTrigger>
														<AlertDialogContent>
															<AlertDialogHeader>
																<AlertDialogTitle>
																	Are you sure want to delete?
																</AlertDialogTitle>
																<AlertDialogDescription>
																	This action cannot be undone. This will
																	permanently delete your URL details and remove
																	the data from our servers.
																</AlertDialogDescription>
															</AlertDialogHeader>
															<AlertDialogFooter>
																<AlertDialogCancel>Cancel</AlertDialogCancel>
																<AlertDialogAction>
																	{/* Continue */}
																	<Form method="post">
																		<input
																			type="text"
																			name="shortId"
																			value={data.shortId}
																			hidden
																			readOnly
																		/>
																		<input type="submit" value="Delete" />
																	</Form>
																</AlertDialogAction>
															</AlertDialogFooter>
														</AlertDialogContent>
													</AlertDialog>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>

								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button variant={"destructive"}>Delete all</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>
												Are you sure want to delete all?
											</AlertDialogTitle>
											<AlertDialogDescription>
												This action cannot be undone. This will permanently
												delete all the URL details and remove the data from our
												servers.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancel</AlertDialogCancel>
											<AlertDialogAction>
												<Form method="post">
													<input
														type="text"
														name="deleteAll"
														value={"true"}
														hidden
														readOnly
													/>
													<input type="submit" value="Delete" />
												</Form>
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</>
						) : (
							"No URL found"
						)}
					</>
				) : (
					"loading..."
				)}
			</Card>
		</div>
	);
};
export default Dashboard;
