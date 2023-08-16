import {usePageContext} from "../../../renderer/usePageContext";
import Listing from "../listing";

export {Page}

function Page() {
	const context = usePageContext();
	const url = context.urlPathname;
	const id = url.split("/")[3];

	return <Listing type="private" id={id}/>;
}