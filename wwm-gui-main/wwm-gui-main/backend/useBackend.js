import Backend, { BackendAPI } from "./BackendAPI";
import useGlobals from "./useGlobals";
import axios from "axios";

/**
 *
 * @returns {BackendAPI}
 */
export default function () {
	const globals = useGlobals();

	Backend.setGlobals(globals);
	return Backend;
}
