import axios from "axios"
import React from "react"
import { useState } from "react"

interface selectedGuest {
	name: string
	group: [string, number][]
	rsvpStatus: string
}

interface formInput {
	name: string
	index: string
	attendance: boolean
	dietary: string
}

function RsvpForm() {
	const [searchInput, setSearchInput] = useState("")
	const [searchResults, setSearchResults] = useState([])
	const [selectedGuest, setSelectedGuest] = useState<selectedGuest | null>(
		null
	)
	const [formInput, setFormInput] = useState<formInput[]>([])

	function handleSearchInput(event: React.ChangeEvent<HTMLInputElement>) {
		setSearchInput(event.target.value)
	}

	function handleSearch() {
		if (searchInput !== "") {
			axios
				.get(
					"https://script.google.com/macros/s/AKfycbyM-9QSmfJV5fq7D2f39B7ZAC6qGz8MpbY4YzElXK9aWMPjmqsR8r3Esh-aD6ly5ZawuQ/exec",
					{
						maxRedirects: 0,
						params: {
							actionType: "lookup",
							query: searchInput,
						},
					}
				)
				.then((output) => {
					console.log(output.data)
					setSearchResults(output.data)
				})
		}
	}

	function fetchGuest(event: React.MouseEvent<HTMLButtonElement>) {
		const button = event.target as HTMLButtonElement
		axios
			.get(
				"https://script.google.com/macros/s/AKfycbyM-9QSmfJV5fq7D2f39B7ZAC6qGz8MpbY4YzElXK9aWMPjmqsR8r3Esh-aD6ly5ZawuQ/exec",
				{
					maxRedirects: 0,
					params: {
						actionType: "getDetails",
						query: button.value,
					},
				}
			)
			.then((output) => {
				console.log(output.data)
				setSelectedGuest(output.data)
				formInput.push({
					name: output.data.name,
					index: button.value,
					attendance: false,
					dietary: "",
				})
				output.data.group.forEach((element: string[]) => {
					formInput.push({
						name: element[0],
						index: element[1].toString(),
						attendance: false,
						dietary: "",
					})
				})
			})
	}

	const handleDietary =
		(index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
			formInput[index].dietary = event.target.value
		}

	const handleCheckbox =
		(index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
			formInput[index].attendance = event.target.checked
		}

	function handleSubmission() {
		axios.get(
			"https://script.google.com/macros/s/AKfycbyM-9QSmfJV5fq7D2f39B7ZAC6qGz8MpbY4YzElXK9aWMPjmqsR8r3Esh-aD6ly5ZawuQ/exec",
			{
				maxRedirects: 0,
				params: {
					actionType: "rsvp",
					query: JSON.stringify(formInput),
				},
			}
		)
	}

	return (
		<div className="flex flex-col items-center p-4 h-screen w-full bg-b">
			{selectedGuest !== null ? (
				<div className="flex flex-col">
					<article className="mb-4">RSVPing for</article>
					<article>{selectedGuest.name}</article>
					<div className="flex gap-x-4">
						<article>Attending?</article>
						<input type="checkbox" onChange={handleCheckbox(0)} />
					</div>
					<input
						type="text"
						placeholder="Dietary Requirements"
						onChange={handleDietary(0)}
						className="input input-bordered w-full max-w-xs"
					/>
					<div className="mt-4">
						<article>Group Attendees</article>
						<div className="flex gap-x-6">
							{selectedGuest.group.map((guest, i) => (
								<div key={guest[1]} className="flex flex-col">
									<article>{guest[0]}</article>
									<div className="flex gap-x-2">
										<article>Attending?</article>
										<input
											type="checkbox"
											onChange={handleCheckbox(i + 1)}
										/>
									</div>
									<input
										type="text"
										placeholder="Dietary Requirements"
										onChange={handleDietary(i + 1)}
										className="input input-bordered w-full max-w-xs"
									/>
								</div>
							))}
						</div>
					</div>
					<button
						onClick={handleSubmission}
						className="btn btn-neutral mt-4"
					>
						Submit
					</button>
				</div>
			) : (
				<React.Fragment>
					<div className="flex gap-4">
						<input
							type="text"
							placeholder="Type here"
							onChange={handleSearchInput}
							className="input input-bordered w-full max-w-xs"
						/>
						<button
							onClick={handleSearch}
							className="btn btn-neutral"
						>
							Search
						</button>
					</div>
					<div className="flex flex-col mt-4 gap-y-2">
						{searchResults.map((result) => (
							<button
								key={result[1]}
								value={result[1]}
								onClick={fetchGuest}
								className="btn btn-outline w-full"
							>
								{result[0]}
							</button>
						))}
					</div>
				</React.Fragment>
			)}
		</div>
	)
}

export default RsvpForm
