import React from 'react'
import {PageContextProvider} from './usePageContext'
import type {PageContext} from './types'
import './PageShell.css'
import Navbar from "./navbar";
import {Layout} from "antd";

const {Header, Content} = Layout;

export {PageShell}

function PageShell({children, pageContext}: { children: React.ReactNode; pageContext: PageContext }) {
	return (
		<React.StrictMode>
			<PageContextProvider pageContext={pageContext}>
				<Layout style={{height: "100%"}}>
					<Header style={{background: "white"}}>
						<Navbar/>
					</Header>
					<Content style={{height: "100%"}}>
						{children}
					</Content>
				</Layout>
			</PageContextProvider>
		</React.StrictMode>
	)
}