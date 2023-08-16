import {Button, Col, DatePicker, Divider, Form, InputNumber, Row, Space} from "antd";
import {useEffect, useState} from "react";
import axios from "axios";

type Listing = {
	Cost: number,
	Description: string,
}

export default function Listing(props: {type:"private" | "hotel", id: string}) {
	const {type, id} = props;

	const [listing, setListing] = useState<Listing>({Cost: 0, Description: ""});
	const [idValid, setIdValid] = useState(false);
	const [customerId, setCustomerId] = useState(0);
	const [reservationDates, setReservationDates] = useState<Date[][]>([]);

	useEffect(() => {
		// get listing data
		axios.get(`http://localhost:3001/api/${type}-listing/${id}`).then((res) => {
			console.log(res.data);
			setListing(res.data[0]);
		});
		// get reservation data for this listing
		axios.get(`http://localhost:3001/api/reservations/${type}/${id}`).then((res) => {
			console.log(res.data);
			setReservationDates([]);
			res.data.map((x: { StartDate: Date; Duration: any; }) => {
				const end = new Date(x.StartDate);
				end.setDate(end.getDate() + x.Duration);
				setReservationDates([...reservationDates, [x.StartDate, end]]);
			});
		});
	}, []);

	function validate_id() {
		axios.get(`http://localhost:3001/api/check-customer-id/${customerId}`).then((response) => {
			console.log(response);
			const id_valid = response.data.length > 0;
			setIdValid(id_valid);
		}).catch((error) => {
			console.error('Error checking ID:', error);
		});
	}

	return <>
		<Row gutter={[8, 8]}>
			<Col offset={8} span={16}>
				<h1>Book Room</h1>
			</Col>
			<Col offset={8} span={16}>
				{listing.Description}
			</Col>
			<Col offset={8} span={16}>
				Cost: ${listing.Cost}/night
			</Col>
			<Col offset={8} span={16}>
				<Space>
					<InputNumber addonBefore="ID:" controls={false} onChange={e => setCustomerId(e || 0)} defaultValue={customerId}/>
					<Button type="primary" onClick={validate_id}>Validate ID</Button>
				</Space>
			</Col>
			<Col offset={8} span={8}>
				<Divider />
			</Col>
		</Row>
		<Row gutter={[8, 8]}>
			{reservationDates.length > 0 && <Col offset={8} span={16}>
                There are already reservations at this location for the following dates:
				{reservationDates.map((x, index) => {
					return <div key={index}><>{new Date(x[0]).toLocaleDateString()} - {x[1].toLocaleDateString()}</></div>;
				})}
            </Col>}
			<Col offset={8}>
				<Form disabled={!idValid} onFinish={values => {
					console.log(values);
					axios.post(`http://localhost:3001/api/${type}/add-reservation`, {
						StartDate: values.dates[0]["$d"].toISOString().slice(0, 19).replace('T', ' '),
						EndDate: values.dates[1]["$d"].toISOString().slice(0, 19).replace('T', ' '),
						Duration: Math.round((values.dates[1]["$d"] - values.dates[0]["$d"]) / (1000 * 60 * 60 * 24)),
						CustomerID: customerId,
						HotelListingID: id,
						PrivateListingID: id,
					}).then((res) => {
						console.log(res);
					}).catch((error) => {
						console.error('Error making reservation:', error);
					});
				}}>
					<Form.Item label="Rentable Unit ID" name="dates">
						<DatePicker.RangePicker/>
					</Form.Item>
					<Form.Item>
						<Button type="primary" htmlType="submit">Submit</Button>
					</Form.Item>
				</Form>
			</Col>
		</Row>
	</>;
}