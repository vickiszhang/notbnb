import React, {useContext} from 'react'
import type {PageContext} from './types'

export {PageContextProvider}
// eslint-disable-next-line react-refresh/only-export-components
export {usePageContext}

const Context = React.createContext<PageContext>(undefined as unknown as PageContext)

function PageContextProvider({pageContext, children}: { pageContext: PageContext; children: React.ReactNode }) {
	return <Context.Provider value={pageContext}>{children}</Context.Provider>
}

function usePageContext() {
	return useContext(Context)
}
