import {useEffect, useState} from "react";
import {SearchOutlined} from "@ant-design/icons";
import {Card, Col, Input, Menu, Row, Slider, Space, Checkbox} from "antd";
import type {MenuProps} from "antd";
import axios from "axios";

export {Page}

type HotelListing = {
	HotelListing_ID: number,
	Cost: number,
	Description: string,
	Name: String,
	NumBeds: number,
	NumPeople: number,
	NumRooms: number,
};

type PrivateListing = {
	PrivateListing_ID: number,
	Cost: number,
	Description: string,
	Name: String,
	NumBeds: number,
	NumPeople: number,
	NumRooms: number,
};

type avgs = {
	Name: string,
	Cost: number
};

const options = [
	{ label: "Rooms", value: "rooms" },
	{ label: "Beds", value: "beds" },
	{ label: "Occupants", value: "people" },
];

function ListingCard(props: {type: "user" | "hotel", listing: HotelListing | PrivateListing, id: number}) {
	const {type, listing, id} = props;
	return <Row>
		<Card style={{width: "400px"}}  title={listing.Name} actions={[<a href={`/listings/${type}/` + id}>book</a>]}>
			<Card.Grid hoverable={false} style={{width: "60%"}}>{listing.Description}</Card.Grid>
			<Card.Grid hoverable={false} style={{width: "40%"}}>
				<Space direction="vertical">
					<div>Beds: {listing.NumBeds}</div>
					<div>Rooms: {listing.NumRooms}</div>
					<div>Occupants: {listing.NumPeople}</div>
					<div>${listing.Cost}/night</div>
				</Space>
			</Card.Grid>
		</Card>
	</Row>
}

function Page() {
	const [hotelListings, setHotelListings] = useState<HotelListing[]>([]);
	const [privateListings, setPrivateListings] = useState<PrivateListing[]>([]);
	const [averageCostPerProperty, setAverageCostPerProperty] = useState<avgs[]>([])
	const [peopleRange, setPeopleRange] = useState<[number, number]>([0, 20]);
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
	const [filters, setFilters] = useState<string[]>([]);
	const [items, _] = useState<MenuProps['items']>([
		{
			label: "Price:",
			key: 0,
		},
		{
			label: <Slider range max={1000} defaultValue={priceRange} onChange={setPriceRange}/>,
			key: 1,
		},
		{
			label: "People:",
			key: 2,
		},
		{
			label: <Slider range max={20} defaultValue={peopleRange} onChange={setPeopleRange}/>,
			key: 3,
		},
		{
			label: "Hide/Show Options:",
			key: 4,
		},
		{
			label: <Checkbox.Group options={options} onChange={v => console.log(v)} />,
			key: 5,
		}
	]);

	const [filter, setFilter] = useState("");

	useEffect(() => {
		axios.get(`http://localhost:3001/api/HotelListing/${priceRange[0]}/${priceRange[1]}/${peopleRange[0]}/${peopleRange[1]}/${filters}`).then((res) => {
			console.log(res.data);
			setHotelListings(res.data);
		});
		axios.get(`http://localhost:3001/api/PrivateListing/${priceRange[0]}/${priceRange[1]}/${peopleRange[0]}/${peopleRange[1]}`).then((res) => {
			console.log(res.data);
			setPrivateListings(res.data);
		});
		axios.get(`http://localhost:3001/api/getAvgs/${peopleRange[0]}/${peopleRange[1]}`)
		.then(res => {
			console.log(res.data)
			setAverageCostPerProperty(res.data)

		})
	}, [peopleRange, priceRange]);

	return <>
		<ul>
			{averageCostPerProperty.map(x => {
				return (<li key={averageCostPerProperty.indexOf(x)}>{x.Name} avg cost{x.Cost}, </li>)
			})}
		</ul>
		<Row>
			<Col span={4}>
				<Menu mode="vertical" items={items} style={{height: "100%"}} />
			</Col>
			<Col span={10} offset={6}>
				<Space direction="vertical">
					<h1>Listings</h1>
					<Space>Search: <Input addonAfter={<SearchOutlined />} onChange={e => setFilter(e.target.value)} /></Space>
					{hotelListings.filter(listing => {
						// filter with search bar
						return listing.Name.toLowerCase().includes(filter.toLowerCase()) || listing.Description.toLowerCase().includes(filter.toLowerCase())
					}).map((listing) => {
						return <ListingCard type="hotel" listing={listing} id={listing.HotelListing_ID}/>
					})}
					{privateListings.filter(listing => {
						// filter with search bar
						return listing.Name.toLowerCase().includes(filter.toLowerCase()) || listing.Description.toLowerCase().includes(filter.toLowerCase())
					}).map((listing) => {
						return <ListingCard type="user" listing={listing} id={listing.PrivateListing_ID}/>
					})}
				</Space>
			</Col>
		</Row>
	</>
}