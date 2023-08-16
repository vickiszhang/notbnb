import {useEffect, useState} from "react";
import axios from "axios";

export {Page}

type Stat = {
	CustomerID: number,
	num_reservations: number,
}

function Page() {
	const [statsData, setStatsData] = useState<Stat[]>([]);

	useEffect(() => {
		axios.get("http://localhost:3001/nested-group-by").then(response => {
			setStatsData(response.data);
		}).catch(error => {
			console.error("Error fetching stats:", error);
		});
	}, []);

	return (
		<>
			<h2>Customer Stats</h2>
			<div>
				<h1>Top 3 customers with the most reservations</h1>
				<table>
					<thead>
					<tr>
						<th>Customer ID</th>
						<th>Number of Reservations</th>
					</tr>
					</thead>
					<tbody>
					{statsData.map((item, index) => (
						<tr key={index}>
							<td>{item.CustomerID}</td>
							<td>{item.num_reservations}</td>
						</tr>
					))}
					</tbody>
				</table>
			</div>
		</>
	);
}