import {Form, Input} from "antd";
import axios from "axios";
import ListingBase from "../listingbase";

const {TextArea} = Input;

export {Page}

function Page() {
	return <ListingBase title="Create Listing"
	                    privateForm={[<Form.Item label="Rentable Unit ID" name="RentUnitID">
		<Input/>
	</Form.Item>,
		<Form.Item label="Cost ($/night)" name="Cost">
			<Input/>
		</Form.Item>,
		<Form.Item label="Description" name="Desc">
			<TextArea/>
		</Form.Item>]}
	                    hotelForm={[<Form.Item label="Property ID" name="PropertyID">
		<Input/>
	</Form.Item>,
		<Form.Item label="Room Number" name="RoomNum">
			<Input/>
		</Form.Item>,
		<Form.Item label="Cost ($/night)" name="Cost">
			<Input/>
		</Form.Item>,
		<Form.Item label="Description" name="Desc">
			<TextArea/>
		</Form.Item>]} privateSubmit={values => {
		axios.post(`http://localhost:3001/post-private-listing`, values)
	}} hotelSubmit={values => {
		axios.post(`http://localhost:3001/post-hotel-listing`, values)
	}}/>
}