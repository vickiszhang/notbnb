import {Button, Col, Divider, Form, Input, InputNumber, Radio, RadioChangeEvent, Row, Space} from "antd";
import {useState} from "react";
import axios from "axios";

export {Page}

function Page() {
	const [state, setState] = useState("private");
	const options = [
		{label: "Private Lister", value: "private"},
		{label: "Hotel Affiliate", value: "hotel"},
	]

	function onChange({ target: { value } }: RadioChangeEvent)  {
		console.log('radio checked', value);
		setId(0);
		setIdValid(false);
		setState(value);
	}

	const [id, setId] = useState(0);
	const [idValid, setIdValid] = useState(false);

	function validate_id() {
		console.log(state);
		axios.post("http://localhost:3001/check-poster-id", {
			id_type: state,
			ID: id,
		}).then((response) => {
			console.log(response);
			const id_valid = response.data.found;
			setIdValid(id_valid);
		}).catch((error) => {
			console.error('Error checking ID:', error);
		});
	}

	return <>
		<Row gutter={[8, 8]}>
			<Col offset={8} span={16}>
				<h1>Delete Listing</h1>
			</Col>
			<Col offset={8} span={16}>
				<Space>
					Post as: <Radio.Group value={state} options={options} onChange={onChange} optionType="button"/>
				</Space>
			</Col>
			<Col offset={8} span={16}>
				<Space>
					<InputNumber addonBefore={"ID:"} controls={false} onChange={id => setId(id || 0)} defaultValue={id}/>
					<Button type="primary" onClick={validate_id}>Validate ID</Button>
				</Space>
			</Col>
			<Col offset={8} span={8}>
				<Divider />
			</Col>
		</Row>
		<Row gutter={[8, 8]}>
			<Col offset={8}>
			{state === "private" ?
				<Form disabled={!idValid} onFinish={values => {
					console.log(values);
                    values.PrivateListerID = id;
					axios.post(`http://localhost:3001/delete-private-listing`, values)
				}}>
                    <h3>Enter the ID of the private listing you wish to delete:</h3>
                    <Form.Item label="Rentable Unit ID" name="RentUnitID">
						<Input />
					</Form.Item>
					<Form.Item label="Private Listing ID" name="PrivateListID">
						<Input />
					</Form.Item>
                    <Form.Item>
						<Button type="primary" htmlType="submit">Delete</Button>
					</Form.Item>

				</Form> : <Form disabled={!idValid} onFinish={values => {
					console.log(values);
                    values.HotelID = id;
					axios.post(`http://localhost:3001/delete-hotel-listing`, values)
				}}>
                    <h3>Enter the ID of the hotel listing you wish to delete:</h3>
					<Form.Item label="Property ID" name="PropertyID">
						<Input />
					</Form.Item>
                    <Form.Item label="Hotel Listing ID" name="HotelListID">
						<Input />
					</Form.Item>
                    <Form.Item>
						<Button type="primary" htmlType="submit">Delete</Button>
					</Form.Item>
				</Form>
			}
			</Col>
		</Row>
	</>
}