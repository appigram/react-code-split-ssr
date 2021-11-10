import { ReactElement, JSXElementConstructor } from 'react'
import { matchPath, Route, Routes } from "react-router-dom";
// import Bundle from './bundle'

export interface IJSXModule {
	default: ReactElement<any, string | JSXElementConstructor<any>>;
}

export interface ISSRRoute {
	caseSensitive?: boolean;
  children?: React.ReactNode;
  element?: () => React.FunctionComponentElement<{ mod: Promise<IJSXModule> }>;
  index?: boolean;
  path?: string;
}

export interface IOptions {
	pathname: string;
	routes: ISSRRoute[];
	notFoundComp?: () => React.FunctionComponentElement<{ mod: Promise<IJSXModule> }>;
}

const generateRoutes = async (
	options: IOptions = {
		pathname: "/",
		routes: []
	}
): Promise<ReactElement<any, string | JSXElementConstructor<any>>> => {
	if (!Array.isArray(options.routes) || options.routes.length === 0) {
		throw new Error("options.routes must be an non-empty array");
	}

	const preload = options.routes.find(
		(route) =>
			!!matchPath(route.path, options.pathname)
	);

	const preloadedComp: any =
		preload === undefined
			? await options.notFoundComp().props.mod
			: await preload.element().props.mod;

	const renderComp = (path: string, bundle: React.FC) => {
		if (!preloadedComp) return bundle;
		const isSSR = (preload && preload.path === path) || (!preload && !path);
		return isSSR ? preloadedComp : bundle;
	};

	return (
		<Routes>
			{options.routes.map((props, i) => {
				const element = renderComp(props.path, props.element)
				return (
					<Route
						key={i}
						{...props}
						element={element}
					/>
			)})}
			<Route element={renderComp(null, options.notFoundComp)} />
		</Routes>
	);
};

export default generateRoutes;
