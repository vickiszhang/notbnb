import { AppstoreAddOutlined, UnorderedListOutlined, EditOutlined, DeleteOutlined, LineChartOutlined } from "@ant-design/icons";
import type { MenuProps } from 'antd';
import {Menu} from 'antd';
import {usePageContext} from "./usePageContext";

const items: MenuProps['items'] = [
	{
		label: 'Customer Stats',
		key: '/customerstat',
		icon: <LineChartOutlined />,
	},
	{
		label: 'Update Listing',
		key: '/update',
		icon: <EditOutlined />,
	},
	{
		label: 'Delete Listing',
		key: '/delete',
		icon: <DeleteOutlined />,
	},
	{
		label: 'Post Listing',
		key: '/post',
		icon: <AppstoreAddOutlined />,
	},
	{
		label: 'View Listings',
		key: '/listings',
		icon: <UnorderedListOutlined />,
	},
];

export default function Navbar() {
	const pageContext = usePageContext();
	const path = pageContext.urlPathname || "";
	console.log(path);

	const onClick: MenuProps['onClick'] = (e) => {
		console.log('click ', e);
		window.location.href = e.key;
	};

	return <div style={{display: "flex", justifyContent: "space-between"}}>
		<a href="/">name here</a>
		<Menu disabledOverflow={true} onClick={onClick} selectedKeys={[path]} mode="horizontal" items={items} />
	</div>;
}